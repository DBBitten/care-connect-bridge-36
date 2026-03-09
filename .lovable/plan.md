

## Plano: Corrigir logo (quadrado preto) e cor do nome "Cuidare"

### Problema

1. A imagem PNG tem fundo branco (não transparente) entre as linhas do espiral. O filtro `invert` inverte esse branco para preto, criando o quadrado preto.
2. O texto "Cuidare" usa `text-foreground` (cinza escuro) em vez da cor da marca (terracota).

### Solução

**1. Gerar versão branca do logo com fundo transparente**

Usar a API de geração de imagem (Gemini) para criar uma versão limpa do símbolo espiral em branco sobre fundo transparente. Salvar como `src/assets/cuidare-logo-white.png`.

**2. Atualizar `src/components/CuidareLogo.tsx`**

- Remover o filtro CSS `invert` completamente
- Usar a nova imagem branca diretamente sobre o container `bg-primary`

**3. Corrigir cor do nome "Cuidare"**

Em todos os locais onde aparece `<span>Cuidare</span>`, trocar `text-foreground` por `text-primary`:

- `src/components/layout/Navbar.tsx` (linha 29)
- `src/components/caregiver/CaregiverSidebar.tsx`
- `src/components/client/ClientSidebar.tsx`
- `src/components/admin/AdminSidebar.tsx`

