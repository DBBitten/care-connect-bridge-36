
## Modulo Completo de Termos e Regras - ElderCare

### Resumo Executivo

Este plano detalha a implementacao de um modulo completo de Termos e Regras para a plataforma ElderCare, incluindo documentos legais versionados, aceite obrigatorio com trilha de auditoria, paginas publicas acessiveis via rodape e bloqueios de fluxo quando aceite pendente.

---

### Arquitetura Geral

```text
+------------------+     +------------------+     +------------------+
|    Usuario       |     |     Sistema      |     |      Admin       |
+------------------+     +------------------+     +------------------+
         |                       |                        |
         | Cadastro/Login        |                        |
         +---------------------->|                        |
         |                       | Modal aceite inicial   |
         |<----------------------+                        |
         | Aceita termos         |                        |
         +---------------------->|                        |
         |                       | Registra acceptance    |
         |                       | com versao/IP/UA       |
         |                       |                        |
         | Cuidador: KYC         |                        |
         +---------------------->|                        |
         |                       | Exige aceite termo     |
         |                       | cuidador + regras      |
         |<----------------------+                        |
         |                       |                        |
         |                       |                        | Publica nova versao
         |                       |<-----------------------+
         |                       | Flag reaceite          |
         | Proximo acesso        |                        |
         +---------------------->|                        |
         |                       | Exige novo aceite      |
         |<----------------------+                        |
```

---

### Parte 1: Modelo de Dados

#### 1.1 Tipos TypeScript (src/types/legal.ts)

| Tipo | Campos |
|------|--------|
| LegalDocumentKey | TERMS_OF_USE, PRIVACY_POLICY, CAREGIVER_LIABILITY_TERM, MARKETPLACE_RULES |
| LegalDocument | id, key, title, version, content (markdown), isActive, createdAt, createdBy |
| LegalAcceptance | id, userId, documentKey, documentVersion, acceptedAt, ipAddress, userAgent, metadata, createdAt |
| LegalAuditAction | LEGAL_DOC_CREATED, LEGAL_DOC_PUBLISHED, USER_ACCEPTED_LEGAL_DOC |

#### 1.2 Contexto Legal (src/contexts/LegalContext.tsx)

Gerenciara:
- Lista de documentos ativos por tipo
- Aceites do usuario atual
- Funcoes para aceitar documentos
- Verificacao de pendencias de aceite
- Flag de reaceite necessario
- Registro em audit log

---

### Parte 2: Conteudo dos Documentos

Serao criados 4 documentos legais com conteudo em markdown:

#### 2.1 Termos de Uso
- Definicao do servico como plataforma de intermediacao
- Responsabilidades do usuario
- Pagamentos e cancelamentos (MVP)
- Suspensao e banimento
- Limitacao de responsabilidade
- Foro e contato

#### 2.2 Politica de Privacidade (LGPD)
- Dados coletados (identificacao, contato, KYC, uso)
- Finalidades (verificacao, seguranca, pagamento, suporte)
- Compartilhamentos necessarios
- Retencao e seguranca
- Direitos do titular
- Canal de contato

#### 2.3 Termo de Responsabilidade do Cuidador
- Declaracoes de veracidade
- Prestacao independente (sem vinculo empregaticio)
- Limites de atuacao
- Conduta e seguranca
- Sigilo e dados
- Pagamento e anti-bypass
- Penalidades

#### 2.4 Regras do Marketplace
- Objetivo
- O que o cuidador PODE fazer
- O que PODE com restricoes
- O que NAO PODE (linha vermelha)
- Seguranca e conduta
- Consequencias

---

### Parte 3: Paginas Publicas

#### 3.1 Rotas a criar

| Rota | Pagina | Documento |
|------|--------|-----------|
| /termos | TermsOfUsePage.tsx | TERMS_OF_USE |
| /privacidade | PrivacyPolicyPage.tsx | PRIVACY_POLICY |
| /regras | MarketplaceRulesPage.tsx | MARKETPLACE_RULES |
| /termo-cuidador | CaregiverTermPage.tsx | CAREGIVER_LIABILITY_TERM |

#### 3.2 Layout das paginas publicas

Cada pagina tera:
- Navbar simples
- Titulo + versao + data de atualizacao
- Conteudo renderizado em markdown (formatado)
- Links para outras paginas legais
- Botao "Imprimir" (opcional)
- Footer padrao

#### 3.3 Componente reutilizavel

Criar `LegalDocumentPage.tsx` como componente base que recebe:
- documentKey
- Renderiza automaticamente titulo, versao, conteudo
- Links para navegacao entre documentos

---

### Parte 4: Fluxo de Aceite

#### 4.1 Modal de Aceite Inicial (Cadastro/Login)

Componente: `LegalAcceptanceModal.tsx`

- Exibido apos primeiro login/cadastro
- Checkboxes:
  - "Li e aceito os Termos de Uso"
  - "Li e aceito a Politica de Privacidade"
- Links para abrir documentos em nova aba
- Botao "Continuar" habilitado apenas quando ambos marcados
- Ao aceitar: registrar em LegalAcceptance

#### 4.2 Aceite do Cuidador (antes do KYC)

Modificar `CaregiverKyc.tsx`:

- Adicionar Step 0 (antes dos dados pessoais):
  - Titulo: "Termos do Cuidador"
  - Checkbox: "Li e aceito o Termo de Responsabilidade do Cuidador"
  - Checkbox: "Li e aceito as Regras do Marketplace"
  - Links para abrir documentos
  - Botao "Continuar" so habilita quando ambos aceitos
- Registrar acceptances com versao

#### 4.3 Aceite do Familiar (Agendamento)

Modificar `BookingPage.tsx`:

- Antes do botao de confirmar:
  - Resumo das regras principais (bullet points)
  - Checkbox: "Confirmo que li as Regras do Marketplace"
  - Link para documento completo
- Registrar LegalAcceptance ao confirmar booking

---

### Parte 5: Painel Admin de Documentos Legais

#### 5.1 Lista de Documentos (/admin/legal)

Componente: `AdminLegalDocuments.tsx`

- Tabela com:
  - Titulo do documento
  - Tipo (key)
  - Versao ativa
  - Data de criacao
  - Status (Ativo/Inativo)
  - Botao "Editar" / "Nova versao"
- Filtros por tipo

#### 5.2 Criar/Editar Documento (/admin/legal/new, /admin/legal/:id)

Componente: `AdminLegalDocumentEdit.tsx`

- Formulario:
  - Tipo (dropdown)
  - Titulo
  - Conteudo (textarea grande para markdown)
  - Preview do markdown
- Botoes:
  - "Salvar rascunho"
  - "Publicar" (marca como ativo, versao anterior inativa)
  - "Forcar reaceite" (flag para usuarios daquele papel)

#### 5.3 Estatisticas de aceites

- Contagem de aceites por versao
- Lista de usuarios que precisam reaceitar
- Exportar lista (futuro)

---

### Parte 6: Middleware de Bloqueio

#### 6.1 Componente RequireLegalAcceptance

Funcionalidade:
- Verifica se usuario tem todos os aceites obrigatorios
- Diferencia por tipo de usuario (cuidador vs familiar)
- Redireciona para modal/pagina de aceite se pendente

#### 6.2 Integracoes com bloqueio

| Fluxo | Bloqueio |
|-------|----------|
| Cuidador -> KYC | Exigir Termos + Privacidade + Termo Cuidador + Regras |
| Cuidador -> Aceitar atendimento | Exigir KYC aprovado (que ja inclui termos) |
| Familiar -> Agendar/Pagar | Exigir Termos + Privacidade + Regras |

#### 6.3 Modificar RegisterPage e LoginPage

- Apos login/cadastro bem-sucedido, verificar aceites pendentes
- Se pendente, mostrar modal de aceite antes de redirecionar

---

### Parte 7: Atualizacao do Footer

Modificar `Footer.tsx`:

Adicionar links na secao "Legal":
- Termos de Uso -> /termos
- Politica de Privacidade -> /privacidade
- Regras do Marketplace -> /regras
- Termo do Cuidador -> /termo-cuidador

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/types/legal.ts` | Tipos TypeScript para documentos e aceites |
| `src/contexts/LegalContext.tsx` | Contexto de estado e funcoes legais |
| `src/data/legalDocuments.ts` | Conteudo inicial dos documentos (markdown) |
| `src/pages/legal/TermsOfUsePage.tsx` | Pagina Termos de Uso |
| `src/pages/legal/PrivacyPolicyPage.tsx` | Pagina Politica de Privacidade |
| `src/pages/legal/MarketplaceRulesPage.tsx` | Pagina Regras do Marketplace |
| `src/pages/legal/CaregiverTermPage.tsx` | Pagina Termo do Cuidador |
| `src/components/legal/LegalDocumentPage.tsx` | Componente base para paginas legais |
| `src/components/legal/LegalAcceptanceModal.tsx` | Modal de aceite inicial |
| `src/components/legal/LegalAcceptanceCheckbox.tsx` | Checkbox reutilizavel com link |
| `src/components/legal/RequireLegalAcceptance.tsx` | HOC/componente de bloqueio |
| `src/pages/admin/AdminLegalDocuments.tsx` | Lista de documentos admin |
| `src/pages/admin/AdminLegalDocumentEdit.tsx` | Criar/editar documento |

### Arquivos a Modificar

| Arquivo | Alteracoes |
|---------|------------|
| `src/App.tsx` | Adicionar rotas legais e LegalProvider |
| `src/components/layout/Footer.tsx` | Adicionar links para paginas legais |
| `src/pages/RegisterPage.tsx` | Integrar verificacao de aceite |
| `src/pages/LoginPage.tsx` | Integrar verificacao de aceite |
| `src/pages/caregiver/CaregiverKyc.tsx` | Adicionar step 0 com termos do cuidador |
| `src/pages/BookingPage.tsx` | Adicionar checkbox de regras |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Documentos Legais" |
| `src/types/kyc.ts` | Estender AuditLogEntry para acoes legais |

---

### Registro de Aceite (campos)

Cada aceite registrara:
- userId
- documentKey
- documentVersion
- acceptedAt (timestamp)
- ipAddress (se disponivel via header/API)
- userAgent (navigator.userAgent)
- metadata (JSON: role, city, state)

---

### Fluxo de Reaceite

Quando admin publica nova versao:
1. Versao anterior marcada como inativa
2. Nova versao marcada como ativa
3. Flag `requiresReacceptance` setada para papel afetado
4. No proximo acesso, usuario ve modal de reaceite
5. Apos aceitar, flag limpa para aquele usuario

---

### Ordem de Implementacao

1. Tipos e dados iniciais (legal.ts, legalDocuments.ts)
2. Contexto LegalContext.tsx
3. Componentes base (LegalDocumentPage, LegalAcceptanceCheckbox)
4. Paginas publicas (/termos, /privacidade, /regras, /termo-cuidador)
5. Atualizar Footer com links
6. Modal de aceite inicial
7. Integrar modal no Login/Register
8. Atualizar CaregiverKyc com step de termos
9. Atualizar BookingPage com checkbox de regras
10. Componente RequireLegalAcceptance
11. Paginas admin de documentos legais
12. Atualizar AdminSidebar

---

### Criterios de Aceitacao

1. Paginas publicas de termos/regras existem e sao acessiveis via rodape
2. Aceite obrigatorio funciona no cadastro/login
3. Cuidador nao consegue iniciar KYC sem aceitar termo especifico
4. Familiar nao consegue confirmar agendamento sem aceitar regras
5. Aceites ficam registrados com versao, timestamp, IP e userAgent
6. Admin consegue ver documentos e criar novas versoes
7. Nova versao forca reaceite quando publicada
8. UI clara, acessivel e em portugues BR
9. Todas as acoes registradas no audit log

---

### UI e Tom de Comunicacao

- Linguagem simples e objetiva, sem juridiques excessivo
- Tom acolhedor mas profissional
- Titulos claros com versao e data visivel
- Checkboxes grandes e clicaveis
- Links destacados para abrir documentos
- Feedback visual ao aceitar (toast de confirmacao)
