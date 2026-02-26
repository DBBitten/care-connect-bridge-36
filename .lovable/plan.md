

## Plano: Refinamento do MVP de KYC - ElderCare

### Analise do Estado Atual

O modulo KYC ja esta amplamente implementado. Apos revisar todos os arquivos, identifiquei que o seguinte ja existe e funciona:

- Tipos completos (KycStatus, KycDocumentType, KycSubmission, AuditLog)
- KycContext com todas as operacoes CRUD e audit log
- Wizard de KYC com 4 etapas (Termos, Dados, Documentos, Revisao)
- Validacao de CPF com mascara e digitos verificadores
- Upload de documentos com validacao de formato/tamanho (10MB)
- KycDocumentCard com drag-and-drop, preview e remocao
- KycProgressBar
- KycStatusBanner no CaregiverLayout
- RequireApprovedKyc guard
- AdminKycQueue com filtros por status/cidade/busca
- AdminKycReview com aprovacao/reprovacao/pedir info
- Mock data com 4 cuidadores em status diferentes
- Checkbox "Declaro que as informacoes sao verdadeiras" no Step 3

### Lacunas Identificadas

As seguintes lacunas precisam ser corrigidas para alinhar com os requisitos:

| # | Lacuna | Impacto |
|---|--------|---------|
| 1 | Campo **telefone** ausente em CaregiverKycProfile e no formulario | Dado obrigatorio nao coletado |
| 2 | Tipo de usuario **admin** nao existe no AuthContext | Admin nao tem papel dedicado; login como admin impossivel |
| 3 | Busca publica (SearchCaregivers) nao filtra por KYC aprovado | Cuidadores nao verificados aparecem na busca |
| 4 | Coluna **versao** ausente na tabela do AdminKycQueue | Admin nao ve a versao da submissao |
| 5 | ID_BACK esta nos document configs mas nao foi solicitado | Documento extra desnecessario no MVP |
| 6 | Login nao tem opcao de entrar como admin | Impossivel testar fluxo admin |
| 7 | Seed com admin padrao nao existe | Requisito 9 do spec |

### Alteracoes Planejadas

#### 1. Adicionar campo telefone

**Arquivos:** `src/types/kyc.ts`, `src/contexts/KycContext.tsx`, `src/pages/caregiver/CaregiverKyc.tsx`

- Adicionar `phone: string` em `CaregiverKycProfile`
- Adicionar campo de input telefone com mascara `(XX) XXXXX-XXXX` no Step 1 do wizard
- Adicionar funcoes `formatPhone` e `validatePhone` em `src/lib/validators.ts`
- Incluir phone no `saveProfile` e na validacao do step
- Exibir telefone na AdminKycReview

#### 2. Adicionar role admin no AuthContext

**Arquivo:** `src/contexts/AuthContext.tsx`

- Expandir `UserType` para `"cuidador" | "necessitado" | "admin"`
- Manter compatibilidade com fluxos existentes

#### 3. Adicionar opcao de login como admin

**Arquivo:** `src/pages/LoginPage.tsx`

- Adicionar terceiro card "Sou administrador" na tela de selecao de tipo
- Ao logar como admin, redirecionar para `/admin`
- Nao exigir modal de aceite legal para admin

#### 4. Filtrar busca publica por KYC aprovado

**Arquivo:** `src/pages/SearchCaregivers.tsx`

- Adicionar nota visual "Todos os cuidadores sao verificados" na pagina de busca
- No MVP com dados estaticos, isso e apenas indicativo; quando houver dados reais, filtrar por `kycStatus === 'APPROVED'`

#### 5. Adicionar coluna versao no AdminKycQueue

**Arquivo:** `src/pages/admin/AdminKycQueue.tsx`

- Adicionar coluna "Versao" na tabela entre "Enviado em" e "Atualizado"

#### 6. Remover ID_BACK dos document configs

**Arquivo:** `src/types/kyc.ts`

- Remover entrada `ID_BACK` de `KYC_DOCUMENT_CONFIGS` e do enum `KycDocumentType`
- Manter alinhado com os 5 tipos solicitados: ID_FRONT, SELFIE, CRIMINAL_RECORD_FEDERAL, CRIMINAL_RECORD_STATE, PROOF_OF_ADDRESS

#### 7. Seed com admin e cuidadores de teste

**Arquivo:** `src/contexts/KycContext.tsx`

- Confirmar que os 2 mock caregivers com status diferentes ja existem (Carlos=SUBMITTED, Ana=NEEDS_MORE_INFO, Roberto=APPROVED, Fernanda=REJECTED - ja ha 4, o que excede o requisito de 2)
- Adicionar credenciais de admin padrao nos mock data: `admin@eldercare.com`

#### 8. Exibir telefone na revisao admin

**Arquivo:** `src/pages/admin/AdminKycReview.tsx`

- Adicionar campo telefone na secao "Dados do Cuidador" com icone Phone

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/types/kyc.ts` | Adicionar phone em CaregiverKycProfile; remover ID_BACK |
| `src/lib/validators.ts` | Adicionar formatPhone, validatePhone |
| `src/contexts/AuthContext.tsx` | Adicionar "admin" ao UserType |
| `src/contexts/KycContext.tsx` | Passar phone no saveProfile; atualizar mock data |
| `src/pages/caregiver/CaregiverKyc.tsx` | Adicionar campo telefone no Step 1 |
| `src/pages/admin/AdminKycQueue.tsx` | Adicionar coluna versao |
| `src/pages/admin/AdminKycReview.tsx` | Exibir telefone |
| `src/pages/LoginPage.tsx` | Adicionar opcao admin |
| `src/pages/SearchCaregivers.tsx` | Adicionar badge "verificado" |

### Nenhum Arquivo Novo

Todas as lacunas sao resolvidas com modificacoes em arquivos existentes.

### Ordem de Implementacao

1. Tipos e validadores (kyc.ts, validators.ts)
2. AuthContext (admin role)
3. KycContext (phone, mock data)
4. CaregiverKyc (campo telefone)
5. LoginPage (opcao admin)
6. AdminKycQueue (coluna versao)
7. AdminKycReview (exibir telefone)
8. SearchCaregivers (badge verificado)

