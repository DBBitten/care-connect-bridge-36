import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
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
import { useNotifications } from '@/contexts/NotificationContext';
import { mockKycSubmissions } from '@/data/kycSeed';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

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
  const { addNotification } = useNotifications();
  
  const [allSubmissions, setAllSubmissions] = useState<KycSubmission[]>(() => {
    const stored = localStorage.getItem('kyc_submissions');
    return stored ? JSON.parse(stored) : mockKycSubmissions;
  });
  
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem('kyc_audit_log');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist helpers
  const persistSubmissions = useCallback((s: KycSubmission[]) => {
    setAllSubmissions(s);
    localStorage.setItem('kyc_submissions', JSON.stringify(s));
  }, []);

  const persistAuditLog = useCallback((a: AuditLogEntry[]) => {
    setAuditLog(a);
    localStorage.setItem('kyc_audit_log', JSON.stringify(a));
  }, []);

  // Get current user's submission
  const currentSubmission = useMemo(
    () => allSubmissions.find(s => s.userEmail === user?.email) || null,
    [allSubmissions, user?.email]
  );
  const kycStatus: KycStatus = currentSubmission?.status || 'NOT_STARTED';
  
  // Pending count for admin
  const pendingCount = useMemo(
    () => allSubmissions.filter(s => s.status === 'SUBMITTED').length,
    [allSubmissions]
  );

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
    persistAuditLog([...auditLog, entry]);
  }, [user?.email, auditLog, persistAuditLog]);

  // Save caregiver profile
  const saveProfile = useCallback((profileData: Omit<CaregiverKycProfile, 'userId' | 'createdAt'>) => {
    const userId = user?.email || 'unknown';
    const profile: CaregiverKycProfile = {
      ...profileData,
      userId,
      createdAt: new Date(),
    };

    const existing = allSubmissions.find(s => s.userEmail === user?.email);

    if (existing) {
      persistSubmissions(
        allSubmissions.map(s =>
          s.userEmail === user?.email
            ? { ...s, profile, status: 'IN_PROGRESS' as KycStatus, updatedAt: new Date() }
            : s
        )
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
      persistSubmissions([...allSubmissions, newSubmission]);
    }

    addAuditEntry('KYC_PROFILE_SAVED', 'KYC_SUBMISSION', currentSubmission?.id || 'new');
  }, [user?.email, allSubmissions, currentSubmission?.id, addAuditEntry, persistSubmissions]);

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

    const existing = allSubmissions.find(s => s.userEmail === user?.email);

    if (existing) {
      // Remove existing document of same type if exists
      const filteredDocs = existing.documents.filter(d => d.type !== type);
      persistSubmissions(
        allSubmissions.map(s =>
          s.userEmail === user?.email
            ? {
                ...s,
                documents: [...filteredDocs, document],
                status: s.status === 'NOT_STARTED' ? 'IN_PROGRESS' : s.status,
                updatedAt: new Date()
              }
            : s
        )
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
      persistSubmissions([...allSubmissions, newSubmission]);
    }

    addAuditEntry('KYC_DOCUMENT_UPLOADED', 'KYC_DOCUMENT', document.id, { type, fileName: file.name });
  }, [user?.email, allSubmissions, currentSubmission?.id, addAuditEntry, persistSubmissions]);

  // Remove document
  const removeDocument = useCallback((documentId: string) => {
    persistSubmissions(
      allSubmissions.map(s =>
        s.userEmail === user?.email
          ? { ...s, documents: s.documents.filter(d => d.id !== documentId), updatedAt: new Date() }
          : s
      )
    );
    addAuditEntry('KYC_DOCUMENT_REMOVED', 'KYC_DOCUMENT', documentId);
  }, [user?.email, allSubmissions, addAuditEntry, persistSubmissions]);

  // Submit for review
  const submitForReview = useCallback(() => {
    persistSubmissions(
      allSubmissions.map(s =>
        s.userEmail === user?.email
          ? { ...s, status: 'SUBMITTED' as KycStatus, submittedAt: new Date(), updatedAt: new Date() }
          : s
      )
    );
    addAuditEntry('KYC_SUBMITTED', 'KYC_SUBMISSION', currentSubmission?.id || '');
  }, [user?.email, allSubmissions, currentSubmission?.id, addAuditEntry, persistSubmissions]);

  // Resubmit
  const resubmit = useCallback(() => {
    persistSubmissions(
      allSubmissions.map(s =>
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
  }, [user?.email, allSubmissions, currentSubmission?.id, addAuditEntry, persistSubmissions]);

  // Get submission by ID (for admin)
  const getSubmissionById = useCallback((id: string) => {
    return allSubmissions.find(s => s.id === id);
  }, [allSubmissions]);

  // Approve submission (admin)
  const approveSubmission = useCallback((submissionId: string, notes?: string) => {
    const sub = allSubmissions.find(s => s.id === submissionId);
    persistSubmissions(
      allSubmissions.map(s =>
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
    if (sub) addNotification({ userId: sub.userEmail, type: 'KYC_STATUS_CHANGED', title: 'KYC Aprovado!', body: 'Sua verificação foi aprovada. Você já pode receber agendamentos.', linkUrl: '/cuidador/verificacao' });
  }, [user?.email, allSubmissions, addAuditEntry, addNotification, persistSubmissions]);

  // Reject submission (admin)
  const rejectSubmission = useCallback((submissionId: string, reason: string, details: string) => {
    const sub = allSubmissions.find(s => s.id === submissionId);
    persistSubmissions(
      allSubmissions.map(s =>
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
    if (sub) addNotification({ userId: sub.userEmail, type: 'KYC_STATUS_CHANGED', title: 'KYC Reprovado', body: `Sua verificação foi reprovada: ${details}`, linkUrl: '/cuidador/verificacao' });
  }, [user?.email, allSubmissions, addAuditEntry, addNotification, persistSubmissions]);

  // Request more info (admin)
  const requestMoreInfo = useCallback((submissionId: string, pendingItems: string[], notes?: string) => {
    const sub = allSubmissions.find(s => s.id === submissionId);
    persistSubmissions(
      allSubmissions.map(s =>
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
    if (sub) addNotification({ userId: sub.userEmail, type: 'KYC_STATUS_CHANGED', title: 'Pendências no KYC', body: 'Sua verificação precisa de ajustes. Verifique os itens pendentes.', linkUrl: '/cuidador/verificacao' });
  }, [user?.email, allSubmissions, addAuditEntry, addNotification, persistSubmissions]);

  // Update document verification (admin)
  const updateDocumentVerification = useCallback((submissionId: string, documentId: string, verified: boolean, comment?: string) => {
    persistSubmissions(
      allSubmissions.map(s =>
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
  }, [allSubmissions, persistSubmissions]);

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
