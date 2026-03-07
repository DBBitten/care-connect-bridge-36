

## Correção: Erro de sintaxe em CaregiverProfileEdit.tsx

As páginas estão em branco porque há um erro de build no arquivo `src/pages/caregiver/CaregiverProfileEdit.tsx`.

**Problema**: Linha 55 tem um `};` extra depois da função `toggleService` (linhas 48-54 já fecham a função corretamente, e a linha 55 adiciona um fechamento duplicado que quebra o parsing do TypeScript).

### Alteração

| Arquivo | Ação |
|---------|------|
| `src/pages/caregiver/CaregiverProfileEdit.tsx` | Remover a linha 55 (`};` extra) |

Isso resolve o erro de build e todas as páginas voltarão a funcionar.

