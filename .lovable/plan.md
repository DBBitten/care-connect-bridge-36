

## Plano: Adicionar abas na página de perfil do cliente

### O que muda

Após o bloco do cabeçalho (foto, nome, botão editar), os dois cards ("Informações Pessoais" e "Informações do Idoso") serão agrupados dentro de um único Card com abas (Tabs). O usuário clica nas abas para alternar entre as seções.

### Alteração em `src/pages/client/ClientProfile.tsx`

- Importar `Tabs, TabsList, TabsTrigger, TabsContent` de `@/components/ui/tabs`
- Substituir os dois Cards separados (linhas 70-178) por um único `Card` contendo:
  - `Tabs` com `defaultValue="pessoais"`
  - `TabsList` com duas abas: "Informações Pessoais" e "Informações do Idoso"
  - `TabsContent value="pessoais"` com o conteúdo atual do primeiro card (campos nome, email, telefone, emergência, endereço)
  - `TabsContent value="idoso"` com o conteúdo do segundo card (nome do idoso, necessidades)
- Os `CardHeader`/`CardTitle` individuais são removidos pois as abas já servem como título de cada seção

Um único arquivo alterado.

