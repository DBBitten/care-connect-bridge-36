

## Plano: Dashboard de Metricas Admin — ElderCare

### Resumo

Criar pagina `/admin/metrics` com metricas do marketplace, funil, graficos de tendencia, tabelas de ranking e export CSV. Todos os dados vem dos contexts existentes (PaymentContext, KycContext, AuthContext). Tambem e necessario adicionar o status `NO_SHOW` ao tipo AppointmentStatus.

### Analise do Estado Atual

- **Appointments/Payments/Refunds**: Persistidos em localStorage via PaymentContext
- **KYC**: Mock + localStorage via KycContext (tem contagens de SUBMITTED, APPROVED, etc.)
- **Reviews**: Nao existe contexto — ReviewPage usa mock hardcoded, sem persistencia
- **NO_SHOW**: Nao existe no enum AppointmentStatus atual
- **Visitantes/Cadastros**: Nao ha tracking — sera marcado como "TODO"

### Arquivos Novos

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/admin/AdminMetrics.tsx` | Pagina completa do dashboard de metricas |
| `src/lib/csvExport.ts` | Utilitario para gerar e baixar CSV |

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `src/types/payment.ts` | Adicionar `NO_SHOW` ao AppointmentStatus |
| `src/App.tsx` | Adicionar rota `/admin/metrics` |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Metricas" com icone BarChart3 |

### Detalhamento Tecnico

#### 1. AppointmentStatus — Adicionar NO_SHOW

```text
AppointmentStatus = 'PAYMENT_PENDING' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW'
```

#### 2. CSV Export (`src/lib/csvExport.ts`)

Funcao generica `exportToCsv(filename, headers, rows)` que:
- Gera string CSV com separador `;` (padrao BR para Excel)
- Cria Blob e dispara download via anchor tag

#### 3. AdminMetrics (`src/pages/admin/AdminMetrics.tsx`)

**Filtros** (topo da pagina):
- Select de periodo: "Ultimos 7 dias", "Ultimos 30 dias", "Ultimos 90 dias", "Personalizado"
- Se personalizado: dois date pickers (de/ate) usando o Calendar/Popover existente
- Select de cidade: "Porto Alegre" (default), "Todas" — campo preparado mas sem filtragem real (appointments nao tem cidade)

**Cards de metricas** (grid 4 colunas):
1. GMV — soma `totalPrice` dos appointments PAID/COMPLETED no periodo
2. Receita Plataforma — soma `platformFee` dos mesmos
3. Atendimentos Criados — count appointments criados no periodo
4. Atendimentos Pagos — count PAID/COMPLETED
5. Taxa de Conversao — pagos / criados (%)
6. Cancelamentos — count CANCELED + % sobre criados
7. No-show — count NO_SHOW + % sobre criados
8. Nota Media — "TODO: integrar reviews" (pois ReviewPage nao persiste dados)

**Funil** (tabela simples):
- Visitantes: "TODO: tracking"
- Cadastros clientes: "TODO: tracking"
- Cadastros cuidadores: "TODO: tracking"
- KYC SUBMITTED: count do KycContext
- KYC APPROVED: count do KycContext
- Appointments criados: count no periodo
- Checkouts iniciados: count Payment INITIATED (se existir)
- Payments PAID: count

**Graficos** (usando Recharts, ja instalado):
1. Serie diaria: appointments criados vs pagos (LineChart com 2 linhas)
2. Serie diaria: GMV (BarChart)
3. Serie diaria: cancelamentos + no-show (LineChart)

Logica de agrupamento por dia:
- Iterar appointments no periodo, agrupar por `date` (ou `createdAt` parseado)
- Gerar array de dias entre inicio e fim do filtro, fill com zeros

**Tabelas de quebra**:
1. Top 10 cuidadores por atendimentos concluidos — agrupar appointments COMPLETED por `caregiverName`, ordenar desc
2. Top 10 por rating — "TODO: integrar reviews" (sem dados persistidos)
3. Tempo medio ate pagar — diff entre `createdAt` do appointment e `paidAt` do payment correspondente, calcular media e mediana

**Export CSV** (3 botoes):
- "Exportar Appointments" — appointments do periodo filtrado
- "Exportar Payments" — payments do periodo
- "Exportar Reviews" — "TODO" (sem dados)

**Performance**:
- Todas as agregacoes sao feitas com `useMemo` sobre os arrays filtrados por periodo
- Nao carrega dados extras — usa os arrays ja em memoria dos contexts

#### 4. Navegacao

AdminSidebar: novo item `{ icon: BarChart3, label: "Metricas", href: "/admin/metrics" }` logo apos "Dashboard"

App.tsx: rota `<Route path="/admin/metrics" element={<AdminMetrics />} />`

### Ordem de Implementacao

1. `src/types/payment.ts` (adicionar NO_SHOW)
2. `src/lib/csvExport.ts`
3. `src/pages/admin/AdminMetrics.tsx`
4. `src/components/admin/AdminSidebar.tsx`
5. `src/App.tsx`

