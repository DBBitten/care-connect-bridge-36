

## Plano: Destaque mais forte no hover dos cards de cuidadores

Atualmente a variante `interactive` usa `hover:border-primary/20` — muito sutil. Vamos tornar a borda mais visível e colorida no hover.

### Alteração

| Arquivo | Mudança |
|---------|---------|
| `src/components/ui/card.tsx` (linha 16) | Trocar `hover:border-primary/20` por `hover:border-primary/50 hover:border-2` na variante `interactive` |

Isso fará a borda ficar mais grossa (2px) e com cor mais saturada ao passar o mouse, criando um destaque claro sem exagero.

