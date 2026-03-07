

## Plano: Botão "Voltar" nos formulários de cadastro e login deve ir ao início

Atualmente, quando o usuário já selecionou o tipo (cuidador/necessitado) e está no formulário, o botão "Voltar" retorna à seleção de tipo (`setUserType(null)`). O pedido é que esse botão leve de volta ao início (`/`).

### Alterações

| Arquivo | Linha | Mudança |
|---------|-------|---------|
| `src/pages/RegisterPage.tsx` | 154-160 | Trocar `<button onClick={() => setUserType(null)}>` por `<Link to="/">`, texto para "Voltar ao início" |
| `src/pages/LoginPage.tsx` | 158-164 | Mesmo: trocar `<button onClick={() => setUserType(null)}>` por `<Link to="/">`, texto para "Voltar ao início" |

Ambas as páginas já têm `Link` importado do react-router-dom.

