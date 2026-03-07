

## Plano: Refatorar Hero para legibilidade e acessibilidade

### Alterações em `src/components/landing/HeroSection.tsx`

**1. Overlay escuro em gradiente (substituir o overlay terracota atual)**
- Trocar de `hsl(12,...)` para gradiente escuro neutro conforme especificado:
  - `from-[rgba(0,0,0,0.48)] via-[rgba(0,0,0,0.30)] to-[rgba(0,0,0,0.18)]`

**2. Conteúdo com larguras limitadas**
- Headline: `max-w-[680px]`
- Subtítulo: `max-w-[600px]`

**3. Copy atualizada**
- Badge: "Profissionais verificados e treinados" (mantém)
- Título: "Cuidado de confiança para quem você **ama**"
- Subtítulo: "Encontre cuidadores verificados para acompanhar sua família com segurança, atenção e carinho."
- CTAs mantêm os mesmos textos

**4. Badge com melhor contraste**
- Fundo: `bg-white/[0.14] backdrop-blur-sm border border-white/20`
- Texto branco sólido

**5. Tipografia com contraste garantido**
- Título: `text-white` (sólido, sem opacidade)
- Subtítulo: `text-white/90` (alta opacidade, não "lavado")
- Stats valores: `text-white`, labels: `text-white/70`
- Sombra sutil de apoio via estilo inline nos textos principais

**6. Botão secundário com melhor contraste**
- Trocar `variant="hero-outline"` por estilo inline: fundo `bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white`
- Ou usar className override no botão existente para garantir legibilidade

**7. Acessibilidade**
- Contraste AA garantido pelo overlay escuro + texto branco sólido
- Área de toque dos botões já é 44px+ (size="xl" = h-14)

### Arquivo único alterado
| Arquivo | Ação |
|---------|------|
| `src/components/landing/HeroSection.tsx` | Reescrever overlay, copy, badge, tipografia e botão secundário |

