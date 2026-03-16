

## Plano: Melhorias de performance e boas práticas

### 1. Criar `src/components/AppProviders.tsx`
Extrair todos os providers de `App.tsx` para um componente dedicado. Ordem mantida: `QueryClientProvider` > `AuthProvider` > `NotificationProvider` > `LegalProvider` > `KycProvider` > `ServiceProvider` > `PaymentProvider` > `CaregiverProvider` > `TooltipProvider`. Inclui também `Toaster` e `Sonner`.

### 2. Refatorar `src/App.tsx`
- Substituir todos os imports de páginas (linhas 15-58) por `React.lazy()`
- Envolver `<Routes>` com `<Suspense fallback={...}>` com spinner "Carregando..."
- Usar `<AppProviders>` envolvendo `<BrowserRouter>`
- Resultado: App.tsx fica limpo com ~50 linhas de lazy imports + rotas

### 3. Melhorar `AuthUser` em `src/contexts/AuthContext.tsx`
- Adicionar `id: string`, `name: string`, `avatarUrl?: string` à interface `AuthUser`
- Atualizar `login` para aceitar `name: string` como 3º parâmetro e gerar `id` com `crypto.randomUUID()`
- Atualizar `StoredAuth` e `AuthContextType`
- Adicionar comentário de aviso sobre autenticação simulada acima da função `login`

### 4. Atualizar chamadas de `login`
- **`src/pages/LoginPage.tsx`** (linha 39): `login(email, userType!)` → `login(email, userType!, email.split("@")[0])` (usa parte do email como nome temporário)
- **`src/pages/RegisterPage.tsx`** (linha 69): `login(formData.email, userType!)` → `login(formData.email, userType!, formData.name)`

