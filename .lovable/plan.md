

## Plano: Nomes dos cuidadores como links para o perfil

Transformar os nomes dos cuidadores exibidos no dashboard do cliente em links clicáveis que levam ao perfil completo.

### Mapeamento de dados

Os dados são hardcoded. Vamos adicionar um campo `caregiverId` a cada item para gerar a URL `/cuidador/:id`:
- Maria Silva → `cg-1`
- Ana Santos → `cg-2`
- Carla Mendes → `cg-4`

### Alterações em `src/pages/client/ClientDashboard.tsx`

1. Adicionar `caregiverId` aos arrays `upcomingAppointments`, `recentCaregivers` e `pendingReviews`
2. Nos 3 locais onde o nome do cuidador aparece (linhas 148, 183, 204), envolver o nome em `<Link to={/cuidador/${id}}>` com estilo `hover:underline text-primary cursor-pointer`

