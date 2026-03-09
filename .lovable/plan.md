

## Plano: Avaliação inline no Dashboard do Cliente

Em vez de redirecionar para outra página, o botão "Avaliar atendimento" na seção de "Avaliações Pendentes" do dashboard vai expandir um formulário de avaliação inline (estrelas + comentário + botão enviar), similar ao que já existe em `ClientReviews.tsx`.

### Alterações em `src/pages/client/ClientDashboard.tsx`

1. **Adicionar estado local** para controlar qual review está ativa (`reviewingId`), a nota (`rating`) e o comentário (`comment`)
2. **Importar** `Textarea`, `useState`, `useToast`
3. **Substituir o botão `<Link>`** na seção de pendingReviews por lógica condicional:
   - Se `reviewingId !== review.id`: mostra o botão "Avaliar atendimento" que seta o `reviewingId`
   - Se `reviewingId === review.id`: mostra o formulário inline com estrelas interativas, textarea e botões "Enviar" / "Cancelar"
4. **Ao submeter**: exibir toast de sucesso e limpar o estado (reutilizando o padrão já implementado em `ClientReviews.tsx`)

A experiência será idêntica à que já existe na página de avaliações, mas embutida diretamente no card do dashboard.

