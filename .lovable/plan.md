

## Plano: Remover efeito de elevação no hover dos cards da TrustSection

O efeito de "relevo" vem da variante `feature` no `card.tsx`: `hover:shadow-xl hover:-translate-y-1`. Basta remover o `hover:-translate-y-1` e o `hover:shadow-xl` dessa variante.

### Alteração

| Arquivo | Mudança |
|---------|---------|
| `src/components/ui/card.tsx` | Variante `feature`: trocar `"shadow-card hover:shadow-xl hover:-translate-y-1"` por `"shadow-card"` |

O destaque no ícone (via `group-hover`) na TrustSection continuará funcionando normalmente.

