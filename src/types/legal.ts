// Legal document keys
export type LegalDocumentKey = 
  | 'TERMS_OF_USE'
  | 'PRIVACY_POLICY'
  | 'CAREGIVER_LIABILITY_TERM'
  | 'MARKETPLACE_RULES';

// Legal document
export interface LegalDocument {
  id: string;
  key: LegalDocumentKey;
  title: string;
  version: number;
  content: string; // markdown
  isActive: boolean;
  createdAt: Date;
  createdBy?: string;
  requiresReacceptance?: boolean;
  affectedRoles?: ('cuidador' | 'necessitado')[];
}

// Legal acceptance record
export interface LegalAcceptance {
  id: string;
  userId: string;
  documentKey: LegalDocumentKey;
  documentVersion: number;
  acceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: {
    role?: 'cuidador' | 'necessitado';
    city?: string;
    state?: string;
  };
  createdAt: Date;
}

// Audit actions for legal
export type LegalAuditAction = 
  | 'LEGAL_DOC_CREATED'
  | 'LEGAL_DOC_PUBLISHED'
  | 'LEGAL_DOC_UPDATED'
  | 'USER_ACCEPTED_LEGAL_DOC';

// Document display info
export interface LegalDocumentInfo {
  key: LegalDocumentKey;
  title: string;
  shortTitle: string;
  route: string;
  description: string;
  requiredFor: ('cuidador' | 'necessitado' | 'all')[];
  requiredAtStage: 'registration' | 'kyc' | 'booking';
}

export const LEGAL_DOCUMENT_INFO: LegalDocumentInfo[] = [
  {
    key: 'TERMS_OF_USE',
    title: 'Termos de Uso',
    shortTitle: 'Termos',
    route: '/termos',
    description: 'Termos gerais de uso da plataforma ElderCare',
    requiredFor: ['all'],
    requiredAtStage: 'registration',
  },
  {
    key: 'PRIVACY_POLICY',
    title: 'Política de Privacidade',
    shortTitle: 'Privacidade',
    route: '/privacidade',
    description: 'Como coletamos e usamos seus dados (LGPD)',
    requiredFor: ['all'],
    requiredAtStage: 'registration',
  },
  {
    key: 'CAREGIVER_LIABILITY_TERM',
    title: 'Termo de Responsabilidade do Cuidador',
    shortTitle: 'Termo do Cuidador',
    route: '/termo-cuidador',
    description: 'Responsabilidades e compromissos do cuidador',
    requiredFor: ['cuidador'],
    requiredAtStage: 'kyc',
  },
  {
    key: 'MARKETPLACE_RULES',
    title: 'Regras do Marketplace',
    shortTitle: 'Regras',
    route: '/regras',
    description: 'O que pode e não pode na plataforma',
    requiredFor: ['all'],
    requiredAtStage: 'kyc',
  },
];

// Helper to get document info by key
export const getDocumentInfo = (key: LegalDocumentKey): LegalDocumentInfo | undefined => {
  return LEGAL_DOCUMENT_INFO.find(doc => doc.key === key);
};
