

## Plano: Adicionar Navbar nas páginas de Login e Cadastro

Ambas as páginas (`LoginPage.tsx` e `RegisterPage.tsx`) não possuem a Navbar. Precisam importá-la e adicioná-la no topo, além de ajustar o layout para que o conteúdo não fique sob a navbar fixa (que tem `h-16`).

### Alterações

| Arquivo | Ação |
|---------|------|
| `src/pages/LoginPage.tsx` | Importar `Navbar`, adicionar `<Navbar />` no topo dos dois `return` (seleção de tipo e formulário), adicionar `pt-16` ao container principal |
| `src/pages/RegisterPage.tsx` | Mesmo: importar `Navbar`, adicionar nos dois `return`, adicionar `pt-16` |

Cada página tem dois blocos `return` (um para seleção de tipo de usuário, outro para o formulário). A Navbar será adicionada em ambos os blocos.

