import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  KycStatus, 
  KycSubmission, 
  KycDocument, 
  CaregiverKycProfile,
  KycDocumentType,
  AuditLogEntry,
  KycAuditAction,
  KYC_DOCUMENT_CONFIGS
} from '@/types/kyc';
import { useAuth } from '@/contexts/AuthContext';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock data for admin testing
const createMockSubmissions = (): KycSubmission[] => [
  {
    id: 'sub_1',
    userId: 'user_1',
    userName: 'Carlos Mendes',
    userEmail: 'carlos@email.com',
    status: 'SUBMITTED',
    profile: {
      userId: 'user_1',
      cpf: '123.456.789-09',
      birthDate: '1985-03-15',
      city: 'Porto Alegre',
      state: 'RS',
      createdAt: new Date('2024-01-10'),
    },
    documents: [
      { id: 'doc_1', submissionId: 'sub_1', type: 'ID_FRONT', fileName: 'rg_frente.jpg', fileUrl: '/placeholder.svg', fileSize: 1024000, uploadedAt: new Date('2024-01-10'), verifiedFlag: false },
      { id: 'doc_2', submissionId: 'sub_1', type: 'SELFIE', fileName: 'selfie.jpg', fileUrl: '/placeholder.svg', fileSize: 2048000, uploadedAt: new Date('2024-01-10'), verifiedFlag: false },
      { id: 'doc_3', submissionId: 'sub_1', type: 'CRIMINAL_RECORD_FEDERAL', fileName: 'certidao_pf.pdf', fileUrl: '/placeholder.svg', fileSize: 512000, uploadedAt: new Date('2024-01-10'), verifiedFlag: false },
      { id: 'doc_4', submissionId: 'sub_1', type: 'CRIMINAL_RECORD_STATE', fileName: 'certidao_rs.pdf', fileUrl: '/placeholder.svg', fileSize: 512000, uploadedAt: new Date('2024-01-10'), verifiedFlag: false },
    ],
    submittedAt: new Date('2024-01-10'),
    version: 1,
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    userName: 'Ana Paula Santos',
    userEmail: 'ana.paula@email.com',
    status: 'NEEDS_MORE_INFO',
    profile: {
      userId: 'user_2',
      cpf: '987.654.321-00',
      birthDate: '1990-07-22',
      city: 'Porto Alegre',
      state: 'RS',
      createdAt: new Date('2024-01-08'),
    },
    documents: [
      { id: 'doc_5', submissionId: 'sub_2', type: 'ID_FRONT', fileName: 'cnh.jpg', fileUrl: '/placeholder.svg', fileSize: 1024000, uploadedAt: new Date('2024-01-08'), verifiedFlag: true },
      { id: 'doc_6', submissionId: 'sub_2', type: 'SELFIE', fileName: 'foto.png', fileUrl: '/placeholder.svg', fileSize: 2048000, uploadedAt: new Date('2024-01-08'), verifiedFlag: false, adminComment: 'Selfie borrada, por favor envie novamente' },
    ],
    pendingItems: ['SELFIE', 'CRIMINAL_RECORD_FEDERAL', 'CRIMINAL_RECORD_STATE'],
    submittedAt: new Date('2024-01-08'),
    reviewedAt: new Date('2024-01-09'),
    reviewerId: 'admin_1',
    version: 1,
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    userName: 'Roberto Lima',
    userEmail: 'roberto.lima@email.com',
    status: 'APPROVED',
    profile: {
      userId: 'user_3',
      cpf: '111.222.333-44',
      birthDate: '1978-11-05',
      city: 'Canoas',
      state: 'RS',
      createdAt: new Date('2024-01-01'),
    },
    documents: [
      { id: 'doc_7', submissionId: 'sub_3', type: 'ID_FRONT', fileName: 'documento.pdf', fileUrl: '/placeholder.svg', fileSize: 1024000, uploadedAt: new Date('2024-01-01'), verifiedFlag: true },
      { id: 'doc_8', submissionId: 'sub_3', type: 'SELFIE', fileName: 'selfie.jpg', fileUrl: '/placeholder.svg', fileSize: 2048000, uploadedAt: new Date('2024-01-01'), verifiedFlag: true },
      { id: 'doc_9', submissionId: 'sub_3', type: 'CRIMINAL_RECORD_FEDERAL', fileName: 'pf.pdf', fileUrl: '/placeholder.svg', fileSize: 512000, uploadedAt: new Date('2024-01-01'), verifiedFlag: true },
      { id: 'doc_10', submissionId: 'sub_3', type: 'CRIMINAL_RECORD_STATE', fileName: 'rs.pdf', fileUrl: '/placeholder.svg', fileSize: 512000, uploadedAt: new Date('2024-01-01'), verifiedFlag: true },
    ],
    submittedAt: new Date('2024-01-01'),
    reviewedAt: new Date('2024-01-02'),
    reviewerId: 'admin_1',
    version: 1,
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'sub_4',
    userId: 'user_4',
    userName: 'Fernanda Costa',
    userEmail: 'fernanda@email.com',
    status: 'REJECTED',
    profile: {
      userId: 'user_4',
      cpf: '555.666.777-88',
      birthDate: '1995-02-18',
      city: 'Gravataí',
      state: 'RS',
      createdAt: new Date('2024-01-05'),
    },
    documents: [
      { id: 'doc_11', submissionId: 'sub_4', type: 'ID_FRONT', fileName: 'doc.jpg', fileUrl: '/placeholder.svg', fileSize: 1024000, uploadedAt: new Date('2024-01-05'), verifiedFlag: false, adminComment: 'Documento ilegível' },
    ],
    submittedAt: new Date('2024-01-05'),
    reviewedAt: new Date('2024-01-06'),
    reviewerId: 'admin_1',
    rejectionReason: 'ILLEGIBLE_DOCUMENT',
    rejectionDetails: 'O documento enviado está muito borrado e não é possível verificar as informações.',
    version: 1,
    updatedAt: new Date('2024-01-06'),
  },
];

interface KycContextType {
  // Current user's submission
  currentSubmission: KycSubmission | null;
  kycStatus: KycStatus;
  
  // All submissions (for admin)
  allSubmissions: KycSubmission[];
  
  // Audit log
  auditLog: AuditLogEntry[];
  
  // Actions for caregiver
  saveProfile: (profile: Omit<CaregiverKycProfile, 'userId' | 'createdAt'>) => void;
  uploadDocument: (type: KycDocumentType, file: File) => Promise<void>;
  removeDocument: (documentId: string) => void;
  submitForReview: () => void;
  resubmit: () => void;
  
  // Actions for admin
  getSubmissionById: (id: string) => KycSubmission | undefined;
  approveSubmission: (submissionId: string, notes?: string) => void;
  rejectSubmission: (submissionId: string, reason: string, details: string) => void;
  requestMoreInfo: (submissionId: string, pendingItems: string[], notes?: string) => void;
  updateDocumentVerification: (submissionId: string, documentId: string, verified: boolean, comment?: string) => void;
  
  // Stats for admin
  pendingCount: number;
}

const KycContext = createContext<KycContextType | undefined>(undefined);

export function KycProvider({ children }: { children: ReactNode }) {
  const { user, userType } = useAuth();
  
  const [allSubmissions, setAllSubmissions] = useState<KycSubmission[]>(() => {
    const stored = localStorage.getItem('kyc_submissions');
    return stored ? JSON.parse(stored) : createMockSubmissions();
  });
  
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem('kyc_audit_log');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('kyc_submissions', JSON.stringify(allSubmissions));
  }, [allSubmissions]);

  useEffect(() => {
    localStorage.setItem('kyc_audit_log', JSON.stringify(auditLog));
  }, [auditLog]);

  // Get current user's submission
  const currentSubmission = allSubmissions.find(s => s.userEmail === user?.email) || null;
  const kycStatus: KycStatus = currentSubmission?.status || 'NOT_STARTED';
  
  // Pending count for admin
  const pendingCount = allSubmissions.filter(s => s.status === 'SUBMITTED').length;

  // Add audit log entry
  const addAuditEntry = useCallback((action: KycAuditAction, entityType: 'KYC_SUBMISSION' | 'KYC_DOCUMENT', entityId: string, metadata?: Record<string, unknown>) => {
    const entry: AuditLogEntry = {
      id: generateId(),
      actorUserId: user?.email || 'unknown',
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date(),
    };
    setAuditLog(prev => [...prev, entry]);
  }, [user?.email]);

  // Save caregiver profile
  const saveProfile = useCallback((profileData: Omit<CaregiverKycProfile, 'userId' | 'createdAt'>) => {
    const userId = user?.email || 'unknown';
    const profile: CaregiverKycProfile = {
      ...profileData,
      userId,
      createdAt: new Date(),
    };

    setAllSubmissions(prev => {
      const existing = prev.find(s => s.userEmail === user?.email);
      
      if (existing) {
        return prev.map(s => 
          s.userEmail === user?.email 
            ? { ...s, profile, status: 'IN_PROGRESS' as KycStatus, updatedAt: new Date() }
            : s
        );
      } else {
        const newSubmission: KycSubmission = {
          id: generateId(),
          userId,
          userName: user?.email?.split('@')[0] || 'Usuário',
          userEmail: user?.email || '',
          status: 'IN_PROGRESS',
          profile,
          documents: [],
          version: 1,
          updatedAt: new Date(),
        };
        addAuditEntry('KYC_STARTED', 'KYC_SUBMISSION', newSubmission.id);
        return [...prev, newSubmission];
      }
    });

    addAuditEntry('KYC_PROFILE_SAVED', 'KYC_SUBMISSION', currentSubmission?.id || 'new');
  }, [user?.email, currentSubmission?.id, addAuditEntry]);

  // Upload document
  const uploadDocument = useCallback(async (type: KycDocumentType, file: File) => {
    // Mock upload - in real app, would upload to storage
    const fileUrl = URL.createObjectURL(file);
    
    const document: KycDocument = {
      id: generateId(),
      submissionId: currentSubmission?.id || '',
      type,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      uploadedAt: new Date(),
      verifiedFlag: false,
    };

    setAllSubmissions(prev => {
      const existing = prev.find(s => s.userEmail === user?.email);
      
      if (existing) {
        // Remove existing document of same type if exists
        const filteredDocs = existing.documents.filter(d => d.type !== type);
        return prev.map(s =>
          s.userEmail === user?.email
            ? { 
                ...s, 
                documents: [...filteredDocs, document],
                status: s.status === 'NOT_STARTED' ? 'IN_PROGRESS' : s.status,
                updatedAt: new Date() 
              }
            : s
        );
      } else {
        // Create new submission with document
        const newSubmission: KycSubmission = {
          id: generateId(),
          userId: user?.email || 'unknown',
          userName: user?.email?.split('@')[0] || 'Usuário',
          userEmail: user?.email || '',
          status: 'IN_PROGRESS',
          documents: [document],
          version: 1,
          updatedAt: new Date(),
        };
        addAuditEntry('KYC_STARTED', 'KYC_SUBMISSION', newSubmission.id);
        return [...prev, newSubmission];
      }
    });

    addAuditEntry('KYC_DOCUMENT_UPLOADED', 'KYC_DOCUMENT', document.id, { type, fileName: file.name });
  }, [user?.email, currentSubmission?.id, addAuditEntry]);

  // Remove document
  const removeDocument = useCallback((documentId: string) => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.userEmail === user?.email
          ? { ...s, documents: s.documents.filter(d => d.id !== documentId), updatedAt: new Date() }
          : s
      )
    );
    addAuditEntry('KYC_DOCUMENT_REMOVED', 'KYC_DOCUMENT', documentId);
  }, [user?.email, addAuditEntry]);

  // Submit for review
  const submitForReview = useCallback(() => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.userEmail === user?.email
          ? { ...s, status: 'SUBMITTED' as KycStatus, submittedAt: new Date(), updatedAt: new Date() }
          : s
      )
    );
    addAuditEntry('KYC_SUBMITTED', 'KYC_SUBMISSION', currentSubmission?.id || '');
  }, [user?.email, currentSubmission?.id, addAuditEntry]);

  // Resubmit
  const resubmit = useCallback(() => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.userEmail === user?.email
          ? { 
              ...s, 
              status: 'SUBMITTED' as KycStatus, 
              submittedAt: new Date(), 
              version: s.version + 1,
              pendingItems: undefined,
              rejectionReason: undefined,
              rejectionDetails: undefined,
              updatedAt: new Date() 
            }
          : s
      )
    );
    addAuditEntry('KYC_RESUBMITTED', 'KYC_SUBMISSION', currentSubmission?.id || '');
  }, [user?.email, currentSubmission?.id, addAuditEntry]);

  // Get submission by ID (for admin)
  const getSubmissionById = useCallback((id: string) => {
    return allSubmissions.find(s => s.id === id);
  }, [allSubmissions]);

  // Approve submission (admin)
  const approveSubmission = useCallback((submissionId: string, notes?: string) => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? { 
              ...s, 
              status: 'APPROVED' as KycStatus, 
              reviewedAt: new Date(), 
              reviewerId: user?.email,
              notes,
              updatedAt: new Date() 
            }
          : s
      )
    );
    addAuditEntry('KYC_APPROVED', 'KYC_SUBMISSION', submissionId, { notes });
  }, [user?.email, addAuditEntry]);

  // Reject submission (admin)
  const rejectSubmission = useCallback((submissionId: string, reason: string, details: string) => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? { 
              ...s, 
              status: 'REJECTED' as KycStatus, 
              reviewedAt: new Date(), 
              reviewerId: user?.email,
              rejectionReason: reason,
              rejectionDetails: details,
              updatedAt: new Date() 
            }
          : s
      )
    );
    addAuditEntry('KYC_REJECTED', 'KYC_SUBMISSION', submissionId, { reason, details });
  }, [user?.email, addAuditEntry]);

  // Request more info (admin)
  const requestMoreInfo = useCallback((submissionId: string, pendingItems: string[], notes?: string) => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? { 
              ...s, 
              status: 'NEEDS_MORE_INFO' as KycStatus, 
              reviewedAt: new Date(), 
              reviewerId: user?.email,
              pendingItems,
              notes,
              updatedAt: new Date() 
            }
          : s
      )
    );
    addAuditEntry('KYC_NEEDS_MORE_INFO', 'KYC_SUBMISSION', submissionId, { pendingItems, notes });
  }, [user?.email, addAuditEntry]);

  // Update document verification (admin)
  const updateDocumentVerification = useCallback((submissionId: string, documentId: string, verified: boolean, comment?: string) => {
    setAllSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              documents: s.documents.map(d =>
                d.id === documentId
                  ? { ...d, verifiedFlag: verified, adminComment: comment }
                  : d
              ),
              updatedAt: new Date(),
            }
          : s
      )
    );
  }, []);

  return (
    <KycContext.Provider value={{
      currentSubmission,
      kycStatus,
      allSubmissions,
      auditLog,
      saveProfile,
      uploadDocument,
      removeDocument,
      submitForReview,
      resubmit,
      getSubmissionById,
      approveSubmission,
      rejectSubmission,
      requestMoreInfo,
      updateDocumentVerification,
      pendingCount,
    }}>
      {children}
    </KycContext.Provider>
  );
}

export function useKyc() {
  const context = useContext(KycContext);
  if (context === undefined) {
    throw new Error('useKyc must be used within a KycProvider');
  }
  return context;
}
