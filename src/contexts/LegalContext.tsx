import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  LegalDocument, 
  LegalDocumentKey, 
  LegalAcceptance, 
  LegalAuditAction,
  LEGAL_DOCUMENT_INFO 
} from '@/types/legal';
import { INITIAL_LEGAL_DOCUMENTS } from '@/data/legalDocuments';
import { useAuth } from '@/contexts/AuthContext';

interface LegalAuditEntry {
  id: string;
  actorUserId: string;
  action: LegalAuditAction;
  entityType: 'LEGAL_DOCUMENT' | 'LEGAL_ACCEPTANCE';
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

interface LegalContextType {
  // Documents
  documents: LegalDocument[];
  getActiveDocument: (key: LegalDocumentKey) => LegalDocument | undefined;
  getAllActiveDocuments: () => LegalDocument[];
  
  // Acceptances
  acceptances: LegalAcceptance[];
  hasAccepted: (key: LegalDocumentKey) => boolean;
  hasAcceptedVersion: (key: LegalDocumentKey, version: number) => boolean;
  acceptDocument: (key: LegalDocumentKey) => void;
  acceptMultipleDocuments: (keys: LegalDocumentKey[]) => void;
  
  // Pending checks
  hasPendingInitialAcceptance: () => boolean;
  hasPendingCaregiverAcceptance: () => boolean;
  hasPendingBookingAcceptance: () => boolean;
  getPendingDocuments: (stage: 'registration' | 'kyc' | 'booking') => LegalDocumentKey[];
  
  // Admin functions
  createNewVersion: (key: LegalDocumentKey, title: string, content: string, forceReacceptance: boolean) => void;
  getAcceptanceStats: () => { key: LegalDocumentKey; version: number; count: number }[];
  
  // Audit log
  auditLog: LegalAuditEntry[];
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

const STORAGE_KEY = 'eldercare_legal_acceptances';

export function LegalProvider({ children }: { children: ReactNode }) {
  const { user, userType } = useAuth();
  
  // Initialize documents from mock data
  const [documents, setDocuments] = useState<LegalDocument[]>(INITIAL_LEGAL_DOCUMENTS);
  
  // Load acceptances from localStorage
  const [acceptances, setAcceptances] = useState<LegalAcceptance[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((a: LegalAcceptance) => ({
          ...a,
          acceptedAt: new Date(a.acceptedAt),
          createdAt: new Date(a.createdAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  
  // Audit log
  const [auditLog, setAuditLog] = useState<LegalAuditEntry[]>([]);
  
  // Save acceptances to localStorage whenever they change
  const saveAcceptances = useCallback((newAcceptances: LegalAcceptance[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAcceptances));
    setAcceptances(newAcceptances);
  }, []);
  
  // Log audit entry
  const logAudit = useCallback((
    action: LegalAuditAction,
    entityType: 'LEGAL_DOCUMENT' | 'LEGAL_ACCEPTANCE',
    entityId: string,
    metadata?: Record<string, unknown>
  ) => {
    const entry: LegalAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      actorUserId: user?.email || 'anonymous',
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date(),
    };
    setAuditLog(prev => [...prev, entry]);
  }, [user]);
  
  // Get active document by key
  const getActiveDocument = useCallback((key: LegalDocumentKey): LegalDocument | undefined => {
    return documents.find(doc => doc.key === key && doc.isActive);
  }, [documents]);
  
  // Get all active documents
  const getAllActiveDocuments = useCallback((): LegalDocument[] => {
    return documents.filter(doc => doc.isActive);
  }, [documents]);
  
  // Check if user has accepted a document (any version)
  const hasAccepted = useCallback((key: LegalDocumentKey): boolean => {
    if (!user) return false;
    const activeDoc = getActiveDocument(key);
    if (!activeDoc) return true; // No active document = nothing to accept
    
    return acceptances.some(
      a => a.userId === user.email && 
           a.documentKey === key && 
           a.documentVersion >= activeDoc.version
    );
  }, [user, acceptances, getActiveDocument]);
  
  // Check if user has accepted a specific version
  const hasAcceptedVersion = useCallback((key: LegalDocumentKey, version: number): boolean => {
    if (!user) return false;
    return acceptances.some(
      a => a.userId === user.email && 
           a.documentKey === key && 
           a.documentVersion === version
    );
  }, [user, acceptances]);
  
  // Accept a document
  const acceptDocument = useCallback((key: LegalDocumentKey) => {
    if (!user) return;
    
    const activeDoc = getActiveDocument(key);
    if (!activeDoc) return;
    
    // Check if already accepted this version
    if (hasAcceptedVersion(key, activeDoc.version)) return;
    
    const acceptance: LegalAcceptance = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.email,
      documentKey: key,
      documentVersion: activeDoc.version,
      acceptedAt: new Date(),
      ipAddress: undefined, // Would come from API in real implementation
      userAgent: navigator.userAgent,
      metadata: {
        role: userType || undefined,
        city: 'Porto Alegre',
        state: 'RS',
      },
      createdAt: new Date(),
    };
    
    const newAcceptances = [...acceptances, acceptance];
    saveAcceptances(newAcceptances);
    
    logAudit('USER_ACCEPTED_LEGAL_DOC', 'LEGAL_ACCEPTANCE', acceptance.id, {
      documentKey: key,
      documentVersion: activeDoc.version,
    });
  }, [user, userType, acceptances, getActiveDocument, hasAcceptedVersion, saveAcceptances, logAudit]);
  
  // Accept multiple documents at once
  const acceptMultipleDocuments = useCallback((keys: LegalDocumentKey[]) => {
    keys.forEach(key => acceptDocument(key));
  }, [acceptDocument]);
  
  // Check pending initial acceptance (Termos + Privacidade)
  const hasPendingInitialAcceptance = useCallback((): boolean => {
    if (!user) return false;
    return !hasAccepted('TERMS_OF_USE') || !hasAccepted('PRIVACY_POLICY');
  }, [user, hasAccepted]);
  
  // Check pending caregiver acceptance (Termo Cuidador + Regras)
  const hasPendingCaregiverAcceptance = useCallback((): boolean => {
    if (!user || userType !== 'cuidador') return false;
    return !hasAccepted('CAREGIVER_LIABILITY_TERM') || !hasAccepted('MARKETPLACE_RULES');
  }, [user, userType, hasAccepted]);
  
  // Check pending booking acceptance (Regras)
  const hasPendingBookingAcceptance = useCallback((): boolean => {
    if (!user) return false;
    return !hasAccepted('MARKETPLACE_RULES');
  }, [user, hasAccepted]);
  
  // Get pending documents for a specific stage
  const getPendingDocuments = useCallback((stage: 'registration' | 'kyc' | 'booking'): LegalDocumentKey[] => {
    const pending: LegalDocumentKey[] = [];
    
    LEGAL_DOCUMENT_INFO.forEach(info => {
      if (info.requiredAtStage !== stage) return;
      
      const isRequired = info.requiredFor.includes('all') || 
        (userType && info.requiredFor.includes(userType));
      
      if (isRequired && !hasAccepted(info.key)) {
        pending.push(info.key);
      }
    });
    
    return pending;
  }, [userType, hasAccepted]);
  
  // Admin: Create new version of a document
  const createNewVersion = useCallback((
    key: LegalDocumentKey,
    title: string,
    content: string,
    forceReacceptance: boolean
  ) => {
    const currentActive = getActiveDocument(key);
    const newVersion = currentActive ? currentActive.version + 1 : 1;
    
    const newDoc: LegalDocument = {
      id: `doc-${key.toLowerCase()}-v${newVersion}`,
      key,
      title,
      version: newVersion,
      content,
      isActive: true,
      createdAt: new Date(),
      createdBy: user?.email,
      requiresReacceptance: forceReacceptance,
    };
    
    // Deactivate old versions
    const updatedDocs = documents.map(doc => 
      doc.key === key ? { ...doc, isActive: false } : doc
    );
    
    setDocuments([...updatedDocs, newDoc]);
    
    logAudit('LEGAL_DOC_PUBLISHED', 'LEGAL_DOCUMENT', newDoc.id, {
      key,
      version: newVersion,
      forceReacceptance,
    });
  }, [documents, getActiveDocument, user, logAudit]);
  
  // Get acceptance stats
  const getAcceptanceStats = useCallback(() => {
    const stats: { key: LegalDocumentKey; version: number; count: number }[] = [];
    
    documents.forEach(doc => {
      const count = acceptances.filter(
        a => a.documentKey === doc.key && a.documentVersion === doc.version
      ).length;
      
      stats.push({ key: doc.key, version: doc.version, count });
    });
    
    return stats;
  }, [documents, acceptances]);
  
  return (
    <LegalContext.Provider
      value={{
        documents,
        getActiveDocument,
        getAllActiveDocuments,
        acceptances,
        hasAccepted,
        hasAcceptedVersion,
        acceptDocument,
        acceptMultipleDocuments,
        hasPendingInitialAcceptance,
        hasPendingCaregiverAcceptance,
        hasPendingBookingAcceptance,
        getPendingDocuments,
        createNewVersion,
        getAcceptanceStats,
        auditLog,
      }}
    >
      {children}
    </LegalContext.Provider>
  );
}

export function useLegal() {
  const context = useContext(LegalContext);
  if (context === undefined) {
    throw new Error('useLegal must be used within a LegalProvider');
  }
  return context;
}
