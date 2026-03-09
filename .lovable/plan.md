

## Plano: Substituir PNG por SVG inline no componente do logo

### Problema

O arquivo `cuidare-logo-white.png` gerado é provavelmente inválido ou vazio (a geração de binários PNG não é confiável). O símbolo não aparece, apenas o container terracota.

### Solução

Substituir a dependência de arquivo PNG por um SVG inline diretamente no componente `CuidareLogo.tsx`. O SVG desenhará o símbolo espiral em branco, garantindo que sempre renderize corretamente sem depender de assets binários.

**Arquivo: `src/components/CuidareLogo.tsx`**

- Remover o import do PNG
- Substituir o `<img>` por um `<svg>` inline com o desenho do espiral em branco (`stroke="white"`, sem fill)
- O SVG será um espiral simples usando arcos (`path` com comandos `A`), centralizado no container `bg-primary rounded-xl`

Apenas um arquivo será alterado.

