

## Plano: Substituir ícone da Cuidare pelo novo símbolo e melhorar a página 404

### Resumo

Copiar a imagem do símbolo espiral para o projeto, criar um componente `CuidareLogo` reutilizável (com variantes de tamanho), substituir todas as ocorrências do `ShieldCheck` usado como logo, e redesenhar a página 404 incluindo o novo símbolo.

### Alterações

| Arquivo | Ação |
|---------|------|
| `src/assets/cuidare-logo.png` | Copiar imagem enviada |
| `src/components/CuidareLogo.tsx` | **Novo** — componente reutilizável que renderiza a imagem com `rounded-xl bg-primary` e props de tamanho (`sm`, `md`, `lg`) |
| `src/components/layout/Navbar.tsx` | Trocar `ShieldCheck` pelo `<CuidareLogo />` |
| `src/components/client/ClientSidebar.tsx` | Idem |
| `src/components/caregiver/CaregiverSidebar.tsx` | Idem |
| `src/components/admin/AdminSidebar.tsx` | Idem |
| `src/pages/LoginPage.tsx` | Trocar logo nos 2 locais |
| `src/pages/RegisterPage.tsx` | Trocar logo |
| `src/pages/NotFound.tsx` | Redesenhar: incluir o `<CuidareLogo size="lg" />`, traduzir textos para PT-BR, adicionar botão estilizado "Voltar ao Início" |

### Detalhes do componente CuidareLogo

```tsx
// Props: size ("sm" | "md" | "lg"), className
// sm = w-8 h-8, md = w-10 h-10, lg = w-16 h-16
// Renderiza <div className="rounded-xl bg-primary flex items-center justify-center {size}">
//   <img src={logo} className="w-[60%] h-[60%] object-contain" />
// </div>
```

A imagem será usada com um filtro CSS ou `mix-blend-mode` para se integrar ao fundo terracota do container (o símbolo original é preto sobre fundo claro — dentro do container `bg-primary` terracota ficará invertido/branco via `brightness(0) invert(1)`).

### Página 404 redesenhada

- Fundo `bg-background` com o logo centralizado em tamanho grande
- Título "Página não encontrada" em PT-BR
- Subtítulo explicativo
- Botão primário "Voltar ao Início"

