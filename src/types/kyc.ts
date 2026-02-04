// KYC Status enum
export type KycStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_MORE_INFO';

// Document types enum
export type KycDocumentType = 
  | 'ID_FRONT'
  | 'ID_BACK'
  | 'SELFIE'
  | 'PROOF_OF_ADDRESS'
  | 'CRIMINAL_RECORD_FEDERAL'
  | 'CRIMINAL_RECORD_STATE';

// Document configuration
export interface KycDocumentConfig {
  type: KycDocumentType;
  label: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

export const KYC_DOCUMENT_CONFIGS: KycDocumentConfig[] = [
  {
    type: 'ID_FRONT',
    label: 'Documento com foto (frente)',
    description: 'RG, CNH ou outro documento oficial com foto',
    required: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'ID_BACK',
    label: 'Verso do documento',
    description: 'Verso do documento de identificação (opcional)',
    required: false,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'SELFIE',
    label: 'Selfie',
    description: 'Foto do seu rosto segurando o documento',
    required: true,
    acceptedFormats: ['image/jpeg', 'image/png'],
  },
  {
    type: 'CRIMINAL_RECORD_FEDERAL',
    label: 'Certidão de Antecedentes - Polícia Federal',
    description: 'Certidão de antecedentes criminais da Polícia Federal',
    required: true,
    acceptedFormats: ['application/pdf'],
  },
  {
    type: 'CRIMINAL_RECORD_STATE',
    label: 'Certidão de Antecedentes - RS',
    description: 'Certidão de antecedentes criminais do estado (RS)',
    required: true,
    acceptedFormats: ['application/pdf'],
  },
  {
    type: 'PROOF_OF_ADDRESS',
    label: 'Comprovante de Residência',
    description: 'Conta de luz, água ou outro comprovante recente',
    required: false,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
];

// Caregiver profile data
export interface CaregiverKycProfile {
  userId: string;
  cpf: string;
  birthDate: string;
  city: string;
  state: string;
  addressLine?: string;
  createdAt: Date;
}

// KYC Document
export interface KycDocument {
  id: string;
  submissionId: string;
  type: KycDocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  verifiedFlag: boolean;
  adminComment?: string;
}

// KYC Submission
export interface KycSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: KycStatus;
  profile?: CaregiverKycProfile;
  documents: KycDocument[];
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewerId?: string;
  rejectionReason?: string;
  rejectionDetails?: string;
  pendingItems?: string[];
  notes?: string;
  version: number;
  updatedAt: Date;
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  action: KycAuditAction;
  entityType: 'KYC_SUBMISSION' | 'KYC_DOCUMENT';
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Audit actions
export type KycAuditAction = 
  | 'KYC_STARTED'
  | 'KYC_PROFILE_SAVED'
  | 'KYC_DOCUMENT_UPLOADED'
  | 'KYC_DOCUMENT_REMOVED'
  | 'KYC_SUBMITTED'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'KYC_NEEDS_MORE_INFO'
  | 'KYC_RESUBMITTED';

// Rejection reasons
export const KYC_REJECTION_REASONS = [
  { value: 'ILLEGIBLE_DOCUMENT', label: 'Documento ilegível' },
  { value: 'CPF_MISMATCH', label: 'CPF divergente' },
  { value: 'INSUFFICIENT_SELFIE', label: 'Selfie insuficiente' },
  { value: 'INVALID_CERTIFICATE', label: 'Certidão inválida' },
  { value: 'INCOMPLETE_INFO', label: 'Informações incompletas' },
  { value: 'FRAUD_SUSPICION', label: 'Suspeita de fraude' },
] as const;

export type KycRejectionReason = typeof KYC_REJECTION_REASONS[number]['value'];
