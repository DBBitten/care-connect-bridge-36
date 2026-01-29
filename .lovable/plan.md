
## Corrigir Links de Navegacao com Ancoras

### Resumo
Vou implementar navegacao por ancoras para os links "Como Funciona" e "Sobre", fazendo com que eles rolem suavemente para as secoes correspondentes na pagina inicial.

---

### Arquivos a Modificar

#### 1. HowItWorksSection.tsx
Adicionar `id="como-funciona"` na tag `<section>` para permitir navegacao por ancora.

#### 2. TrustSection.tsx
Adicionar `id="sobre"` na tag `<section>` para usar como destino do link "Sobre".

#### 3. Navbar.tsx
Alterar os links de navegacao:
- "Como Funciona": trocar `<Link to="/como-funciona">` por `<a href="/#como-funciona">`
- "Sobre": trocar `<Link to="/sobre">` por `<a href="/#sobre">`

Isso se aplica tanto ao menu desktop (linhas 26-31) quanto ao menu mobile (linhas 65-78).

#### 4. Footer.tsx
Alterar os links:
- "Como Funciona" (linha 28): trocar para `<a href="/#como-funciona">`
- "Sobre" (linha 50): trocar para `<a href="/#sobre">`

---

### Detalhes Tecnicos

**Por que usar `<a>` ao inves de `<Link>`?**

O componente `<Link>` do React Router intercepta cliques e faz navegacao via JavaScript, mas nao processa hashes para rolagem automaticamente. Usar tags `<a>` nativas permite que o navegador:
1. Navegue para a pagina inicial (`/`)
2. Role automaticamente para o elemento com o `id` correspondente

**Comportamento esperado:**
- Se o usuario esta em outra pagina (ex: `/login`), clicar em "Como Funciona" vai para a pagina inicial e rola ate a secao
- Se ja esta na pagina inicial, rola diretamente para a secao
- O scroll acontece suavemente gracas ao CSS `scroll-behavior: smooth` que ja pode estar configurado

---

### Alteracoes por Arquivo

**HowItWorksSection.tsx** - Linha 23:
```tsx
// De:
<section className="py-20 bg-background">

// Para:
<section id="como-funciona" className="py-20 bg-background">
```

**TrustSection.tsx** - Linha 39:
```tsx
// De:
<section className="py-20 trust-gradient">

// Para:
<section id="sobre" className="py-20 trust-gradient">
```

**Navbar.tsx** - Links desktop e mobile serao alterados de `<Link>` para `<a>` com os hrefs corretos.

**Footer.tsx** - Links de "Como Funciona" e "Sobre" serao alterados de `<Link>` para `<a>`.
