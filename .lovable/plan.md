

## Plano: Gerar nova imagem hero na paleta Cuidare

### Resumo

Usar a API de geração de imagem (Gemini) para criar uma nova imagem hero que combine com a paleta Terracota & Creme da Cuidare — tons quentes, acolhedores, com cena de cuidado humano — e substituir o asset atual.

### Alterações

| Arquivo | Ação |
|---------|------|
| `src/assets/hero-eldercare.jpg` | Substituir pela nova imagem gerada via AI |
| `src/components/landing/HeroSection.tsx` | Atualizar o import para o novo nome de arquivo (ex: `hero-cuidare.png`) e ajustar o overlay gradient para complementar a nova paleta |

### Detalhes

1. **Gerar imagem** via `google/gemini-2.5-flash-image` com prompt descrevendo: cena acolhedora de cuidadora com idoso, tons quentes terracota (#B5472A), creme (#FBF4EC), iluminação suave, estilo fotográfico profissional.

2. **Salvar** como `src/assets/hero-cuidare.png`.

3. **Ajustar overlay** no HeroSection: trocar o gradient escuro (`from-foreground/90`) por um gradient em tons de terracota/marrom quente que harmonize com a imagem e mantenha legibilidade do texto branco.

4. **Atualizar import** de `hero-eldercare.jpg` para `hero-cuidare.png`.

