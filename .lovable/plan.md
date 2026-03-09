

## Plano: Corrigir filtro CSS do logo

### Problema

O filtro `brightness-0 invert` no `<img>` transforma pixels semi-transparentes em brancos sólidos, criando um quadrado branco ao redor do símbolo.

### Solução

No `src/components/CuidareLogo.tsx`, trocar `brightness-0 invert` por apenas `invert`, que inverte preto para branco preservando a transparência original da imagem.

Linha 27:
```tsx
// De:
className={cn("object-contain brightness-0 invert", imgSizeMap[size])}
// Para:
className={cn("object-contain invert", imgSizeMap[size])}
```

Uma única alteração em um único arquivo.

