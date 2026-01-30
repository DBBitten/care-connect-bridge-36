
## Corrigir Redirecionamento de Login e Adicionar Botao "Meu Painel" na Navbar

### Resumo
Vou corrigir o redirecionamento apos login para usuarios do tipo "necessitado" e implementar um estado de autenticacao simulado que mostrara o botao "Meu Painel" na Navbar quando o usuario estiver logado.

---

### Problema Atual

1. **LoginPage.tsx (linha 35)**: Usuarios do tipo "necessitado" sao redirecionados para `/buscar-cuidadores` em vez de `/cliente/dashboard`
2. **Navbar.tsx**: Sempre mostra botoes "Entrar" e "Cadastrar", mesmo apos o login

---

### Solucao Proposta

#### 1. Criar um Contexto de Autenticacao Simulado

Criar um novo arquivo `src/contexts/AuthContext.tsx` para gerenciar o estado de autenticacao em toda a aplicacao:

```text
+---------------------+
|   AuthContext       |
+---------------------+
| - user              |
| - userType          |
| - isAuthenticated   |
| - login()           |
| - logout()          |
+---------------------+
```

O contexto armazenara:
- `user`: dados do usuario (email)
- `userType`: tipo do usuario ("cuidador" | "necessitado")
- `isAuthenticated`: boolean indicando se esta logado
- `login()`: funcao para fazer login
- `logout()`: funcao para fazer logout

#### 2. Modificar LoginPage.tsx

- Importar e usar o contexto de autenticacao
- Corrigir o redirecionamento da linha 35 para `/cliente/dashboard`
- Chamar a funcao `login()` do contexto antes de redirecionar

#### 3. Modificar Navbar.tsx

- Importar e usar o contexto de autenticacao
- Renderizar condicionalmente:
  - **Se logado**: Mostrar botao "Meu Painel" (link para dashboard correspondente) e botao "Sair"
  - **Se nao logado**: Mostrar botoes "Entrar" e "Cadastrar" (comportamento atual)

#### 4. Envolver a Aplicacao com o Provider

- Modificar `App.tsx` para incluir o `AuthProvider` envolvendo todas as rotas

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/contexts/AuthContext.tsx` | Contexto de autenticacao com estado e funcoes |

### Arquivos a Modificar

| Arquivo | Alteracoes |
|---------|------------|
| `src/pages/LoginPage.tsx` | Usar contexto, corrigir redirecionamento para `/cliente/dashboard` |
| `src/components/layout/Navbar.tsx` | Adicionar logica condicional para mostrar "Meu Painel" e "Sair" |
| `src/App.tsx` | Envolver rotas com `AuthProvider` |

---

### Detalhes Tecnicos

**AuthContext.tsx - Estrutura:**
```tsx
interface AuthContextType {
  user: { email: string } | null;
  userType: "cuidador" | "necessitado" | null;
  isAuthenticated: boolean;
  login: (email: string, userType: "cuidador" | "necessitado") => void;
  logout: () => void;
}
```

**Navbar.tsx - Logica Condicional:**
```tsx
// Se autenticado:
// - Mostrar "Meu Painel" -> link para /cuidador/dashboard ou /cliente/dashboard
// - Mostrar "Sair" -> chama logout() e redireciona para /

// Se nao autenticado:
// - Mostrar "Entrar" e "Cadastrar" (atual)
```

**Persistencia:**
O estado de autenticacao sera armazenado em `localStorage` para persistir entre recarregamentos da pagina, simulando uma sessao real.

---

### Comportamento Esperado

1. Usuario acessa `/login`
2. Seleciona "Preciso de cuidador" (necessitado)
3. Preenche email e senha, clica em "Entrar"
4. Sistema redireciona para `/cliente/dashboard`
5. Navbar agora mostra "Meu Painel" e "Sair" em vez de "Entrar" e "Cadastrar"
6. Clicar em "Meu Painel" leva ao dashboard correspondente
7. Clicar em "Sair" desloga e volta para a pagina inicial
