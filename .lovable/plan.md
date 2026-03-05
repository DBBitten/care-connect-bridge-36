

## Plano: Card do cuidador como link clicável

Envolver todo o `<Card>` do cuidador em um `<Link>` para `/cuidador/{id}`, tornando o card inteiro clicável. Os botões internos ("Ver perfil" e "Agendar") continuam funcionando normalmente com `e.stopPropagation` implícito do `<a>` aninhado.

### Alteração

| Arquivo | Ação |
|---------|------|
| `src/pages/SearchCaregivers.tsx` | Envolver o `<Card>` (linha 199) em `<Link to={/cuidador/${profile.id}}>` com `className="block"` e adicionar `cursor-pointer` ao card. Manter os botões internos como `<Link>` (já são `<a>`, links aninhados em links não é válido — alternativa: usar `onClick` + `navigate` no card wrapper via `<div onClick>` em vez de `<Link>`) |

### Abordagem técnica

Como HTML não permite `<a>` dentro de `<a>`, a melhor abordagem é:
1. Adicionar `onClick={() => navigate(/cuidador/${profile.id})}` e `cursor-pointer` no `<Card>`
2. Nos botões internos, adicionar `onClick={(e) => e.stopPropagation()}` para evitar dupla navegação
3. Importar `useNavigate` do react-router-dom

Isso torna todo o card clicável sem invalidar o HTML semântico.

