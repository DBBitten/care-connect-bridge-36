
## Modulo KYC para Cuidadores - ElderCare

### Resumo Executivo

Este plano detalha a implementacao de um modulo de verificacao de identidade (KYC) para cuidadores na plataforma ElderCare. O sistema sera semi-manual, onde cuidadores enviam documentos e administradores revisam e aprovam/reprovam as submissoes.

---

### Arquitetura Geral

```text
+------------------+     +------------------+     +------------------+
|    Cuidador      |     |     Sistema      |     |      Admin       |
+------------------+     +------------------+     +------------------+
         |                       |                        |
         | Preenche dados        |                        |
         | Upload documentos     |                        |
         +---------------------->|                        |
         |                       | Armazena no banco      |
         |                       | Status: SUBMITTED      |
         |                       +----------------------->|
         |                       |                        | Revisa
         |                       |                        | Aprova/Reprova
         |                       |<-----------------------+
         | Recebe notificacao    |                        |
         | Status atualizado     |                        |
         |<----------------------+                        |
         |                       |                        |
```

---

### Parte 1: Modelo de Dados

Como nao ha Supabase configurado, implementaremos com dados mockados em contextos React, preparados para integracao futura.

#### 1.1 Tipos TypeScript (src/types/kyc.ts)

| Tipo | Campos |
|------|--------|
| KycStatus | NOT_STARTED, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED, NEEDS_MORE_INFO |
| KycDocumentType | ID_FRONT, ID_BACK, SELFIE, PROOF_OF_ADDRESS, CRIMINAL_RECORD_FEDERAL, CRIMINAL_RECORD_STATE |
| CaregiverProfile | userId, cpf, birthDate, city, state, addressLine, createdAt |
| KycSubmission | id, userId, status, submittedAt, reviewedAt, reviewerId, rejectionReason, notes, version, pendingItems |
| KycDocument | id, submissionId, type, fileName, fileUrl, uploadedAt, verifiedFlag, adminComment |
| AuditLogEntry | id, actorUserId, action, entityType, entityId, metadata, createdAt |

#### 1.2 Contexto KYC (src/contexts/KycContext.tsx)

Gerenciara:
- Estado da submissao atual do cuidador
- Lista de documentos enviados
- Funcoes para criar/atualizar submissao
- Funcoes para upload de documentos (mock)
- Registro de audit log

---

### Parte 2: Paginas do Cuidador

#### 2.1 Pagina KYC Wizard (src/pages/caregiver/CaregiverKyc.tsx)

Rota: `/cuidador/verificacao`

**Estrutura em Wizard com 3 etapas:**

**Step A - Dados Pessoais:**
- Nome (pre-preenchido do contexto de auth)
- CPF com mascara e validacao de digito verificador
- Data de nascimento
- Cidade (default: Porto Alegre)
- Estado (default: RS)
- Botao "Salvar e continuar"

**Step B - Documentos:**

Cards de upload organizados:

| Documento | Obrigatorio | Formatos |
|-----------|-------------|----------|
| Documento com foto (frente) | Sim | jpg, png, pdf |
| Verso do documento | Nao | jpg, png, pdf |
| Selfie | Sim | jpg, png |
| Certidao PF | Sim | pdf |
| Certidao RS | Sim | pdf |
| Comprovante de residencia | Nao | jpg, png, pdf |

Cada card tera:
- Area de drag-and-drop
- Preview do arquivo
- Botao remover/substituir
- Indicador de status

**Step C - Revisao e Envio:**
- Checklist visual de itens preenchidos
- Checkbox de declaracao
- Botao "Enviar para analise"

#### 2.2 Componentes de Suporte

| Componente | Descricao |
|------------|-----------|
| KycStatusBanner | Banner contextual exibido no topo do layout |
| KycDocumentCard | Card individual para upload de documento |
| KycProgressBar | Barra de progresso das etapas do wizard |
| CpfInput | Input com mascara e validacao de CPF |

---

### Parte 3: Paginas do Admin

#### 3.1 Fila de Verificacoes (src/pages/admin/AdminKycQueue.tsx)

Rota: `/admin/kyc`

**Funcionalidades:**
- Tabela com submissoes pendentes
- Filtros por status, cidade, data
- Colunas: Cuidador, Status, Enviado em, Ultima atualizacao, Acoes
- Badges coloridos por status
- Botao "Revisar" para cada linha

#### 3.2 Revisao de Submissao (src/pages/admin/AdminKycReview.tsx)

Rota: `/admin/kyc/:submissionId`

**Layout em duas colunas:**

**Coluna Esquerda:**
- Dados do cuidador (nome, CPF, nascimento, cidade)
- Cards de documentos com preview/download
- Checkbox de verificacao por documento
- Campo de comentario por documento

**Coluna Direita:**
- Notas internas (textarea)
- Botoes de acao:
  - Aprovar (verde)
  - Solicitar mais info (amarelo) com checklist
  - Reprovar (vermelho) com dropdown de motivo + texto livre

**Motivos de reprovacao padronizados:**
- Documento ilegivel
- CPF divergente
- Selfie insuficiente
- Certidao invalida
- Informacoes incompletas
- Suspeita de fraude

---

### Parte 4: Integracao e Bloqueios

#### 4.1 Atualizacao do CaregiverLayout

Adicionar KycStatusBanner no topo que mostra:
- NOT_STARTED/IN_PROGRESS: "Finalize sua verificacao para receber atendimentos"
- SUBMITTED: "Em analise - retornaremos em breve"
- NEEDS_MORE_INFO: Lista de pendencias + botao corrigir
- REJECTED: Motivo + botao "Corrigir e reenviar"
- APPROVED: "Verificacao aprovada" (badge verde)

#### 4.2 Atualizacao do CaregiverSidebar

Adicionar item de menu:
- Icone: Shield ou FileCheck
- Label: "Verificacao"
- Href: `/cuidador/verificacao`
- Badge indicador de status

#### 4.3 Atualizacao do AdminSidebar

Adicionar item de menu:
- Icone: ShieldCheck
- Label: "KYC"
- Href: `/admin/kyc`
- Badge com contagem de pendentes

#### 4.4 Protecao de Rotas

Criar HOC ou componente `RequireApprovedKyc`:
- Se status != APPROVED, redirecionar para `/cuidador/verificacao`
- Aplicar em rotas de agenda/atendimentos

---

### Parte 5: Validacoes

#### 5.1 Validacao de CPF

Funcao utilitaria em `src/lib/validators.ts`:
- Validar formato (11 digitos)
- Validar digitos verificadores
- Rejeitar CPFs conhecidos como invalidos (todos iguais)

#### 5.2 Validacao de Upload

- Tipos aceitos: jpg, jpeg, png, pdf
- Tamanho maximo: 10MB por arquivo
- Validar antes de "aceitar" o upload

---

### Parte 6: Audit Log

Implementar registro para acoes:
- KYC_STARTED
- KYC_DOCUMENT_UPLOADED
- KYC_SUBMITTED
- KYC_APPROVED
- KYC_REJECTED
- KYC_NEEDS_MORE_INFO
- KYC_RESUBMITTED

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/types/kyc.ts` | Tipos TypeScript para KYC |
| `src/contexts/KycContext.tsx` | Contexto de estado KYC |
| `src/lib/validators.ts` | Funcoes de validacao (CPF, etc) |
| `src/pages/caregiver/CaregiverKyc.tsx` | Wizard KYC do cuidador |
| `src/pages/admin/AdminKycQueue.tsx` | Fila de verificacoes |
| `src/pages/admin/AdminKycReview.tsx` | Pagina de revisao |
| `src/components/kyc/KycStatusBanner.tsx` | Banner de status |
| `src/components/kyc/KycDocumentCard.tsx` | Card de upload |
| `src/components/kyc/KycProgressBar.tsx` | Barra de progresso |
| `src/components/kyc/CpfInput.tsx` | Input de CPF |
| `src/components/kyc/RequireApprovedKyc.tsx` | Componente de protecao de rota |

### Arquivos a Modificar

| Arquivo | Alteracoes |
|---------|------------|
| `src/App.tsx` | Adicionar rotas e KycProvider |
| `src/components/caregiver/CaregiverSidebar.tsx` | Adicionar item Verificacao |
| `src/components/caregiver/CaregiverLayout.tsx` | Adicionar KycStatusBanner |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item KYC |
| `src/pages/caregiver/CaregiverDashboard.tsx` | Adicionar alerta de KYC pendente |

---

### Dados Mock para Desenvolvimento

Criar cuidadores de teste com status variados:
- 1 com status NOT_STARTED
- 1 com status IN_PROGRESS
- 1 com status SUBMITTED (aguardando)
- 1 com status APPROVED
- 1 com status REJECTED
- 1 com status NEEDS_MORE_INFO

---

### Fluxo Visual do Usuario

```text
Cuidador faz login
        |
        v
+---[KYC Aprovado?]---+
|                     |
Nao                  Sim
|                     |
v                     v
Banner aviso      Dashboard normal
+ redireciona     (funcionalidades
para /verificacao    completas)
        |
        v
Wizard KYC (3 etapas)
        |
        v
Envia para analise
        |
        v
Aguarda revisao do Admin
        |
        v
+---[Decisao Admin]---+
|         |           |
Aprovado  Ajustes   Rejeitado
|         |           |
v         v           v
Acesso   Corrigir   Corrigir
total    e reenviar  e reenviar
```

---

### Criterios de Aceitacao

1. Cuidador consegue preencher dados e fazer upload de documentos
2. Cuidador consegue enviar submissao para analise
3. Cuidador ve status atual claramente em banner
4. Admin consegue ver fila de submissoes pendentes
5. Admin consegue revisar documentos com preview
6. Admin consegue aprovar, reprovar ou pedir ajustes
7. Cuidador ve resultado da revisao e pode corrigir se necessario
8. Cuidador sem KYC aprovado nao consegue acessar funcoes de agendamento
9. Todas as acoes sao registradas no audit log

---

### Ordem de Implementacao

1. Tipos e contexto KYC
2. Funcoes de validacao (CPF)
3. Componentes reutilizaveis (Cards, Banner, Progress)
4. Pagina wizard do cuidador
5. Atualizacao do layout e sidebar do cuidador
6. Pagina fila do admin
7. Pagina revisao do admin
8. Atualizacao do sidebar do admin
9. Protecao de rotas
10. Dados mock e testes

