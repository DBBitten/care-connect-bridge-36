

## Plano: Adicionar relevo e destaque hover nos cards de cuidadores

Os cards de cuidadores usam a variante `feature` do `card.tsx`, que atualmente só tem `shadow-card` (sem hover). Mas não podemos modificar a variante `feature` globalmente pois ela é usada na TrustSection onde o hover foi removido intencionalmente.

### Solução

| Arquivo | Mudança |
|---------|---------|
| `src/components/ui/card.tsx` | Adicionar nova variante `interactive`: `"shadow-card hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"` — combina relevo com destaque de borda no hover |
| `src/pages/SearchCaregivers.tsx` | Trocar `variant="feature"` por `variant="interactive"` no card dos cuidadores |

Isso mantém os cards da TrustSection estáticos e dá aos cards de cuidadores o efeito de elevação + destaque sutil na borda ao passar o mouse.

