// Core types for the UniID 2.0 application

export type VerificationStatus = "unverified" | "partial" | "verified" | "revoked"
export type CredentialStatus = "active" | "revoked" | "expired"
export type TrustLevel = "low" | "medium" | "high" | "verified"

export interface User {
  id: string
  did: string
  name: string
  email: string
  profileImage?: string
  verificationStatus: VerificationStatus
  verificationDate?: string
  trustScore: number
  biometricRegistered: boolean
  faceIdRegistered: boolean
  documentVerified: boolean
  keyPair: {
    privateKey: string
    publicKey: string
  }
  settings: UserSettings
  accessLevel: AccessLevel
}

export interface UserSettings {
  useBiometrics: boolean
  useZkp: boolean
  offlineMode: boolean
  notifications: boolean
  privacyMode: boolean
  language: string
  theme: "light" | "dark" | "system"
  autoLock: number // minutes
  backupEnabled: boolean
  lastBackupDate?: string
}

export interface AccessLevel {
  level: "limited" | "partial" | "full"
  features: {
    canShare: boolean
    canVerify: boolean
    offlineSupport: boolean
    metaverseAccess: boolean
    zkpSupport: boolean
  }
}

export interface Issuer {
  id: string
  did: string
  name: string
  domain: string
  logo?: string
  verified: boolean
  category: string
  country: string
  publicKey: string
  trustLevel: TrustLevel
}

export interface CredentialSubject {
  id: string
  [key: string]: any
}

export interface VerifiableCredential {
  "@context": string[]
  id: string
  type: string[]
  issuer: {
    id: string
    name: string
    country?: string
  }
  issuanceDate: string
  expirationDate?: string
  credentialSubject: CredentialSubject
  proof?: {
    type: string
    created: string
    proofPurpose: string
    verificationMethod: string
    proofValue: string
  }
  status: CredentialStatus
  category: string
  trustLevel: TrustLevel
  crossBorder?: boolean
  display: {
    title: string
    description: string
    backgroundColor?: string
    textColor?: string
    logo?: string
  }
}

export interface VerificationRequest {
  id: string
  requester: {
    name: string
    did: string
    logo?: string
    country?: string
  }
  requestedCredentials: string[]
  requestedAttributes: string[]
  purpose: string
  expiresAt: string
  status: "pending" | "approved" | "rejected" | "expired"
  zkpRequired?: boolean
  crossBorder?: boolean
}

export interface MetaverseConnection {
  id: string
  name: string
  platform: string
  avatarId: string
  connectedAt: string
  status: "active" | "inactive" | "pending"
  logo?: string
  sharedAttributes?: string[]
  expiresAt?: string
}

export interface ActivityLogEntry {
  id: string
  type:
    | "credential_issued"
    | "credential_shared"
    | "verification_request"
    | "metaverse_connection"
    | "access_change"
    | "verification_status_change"
    | "backup_created"
    | "recovery_completed"
  credential?: string
  issuer?: string
  verifier?: string
  requester?: string
  platform?: string
  credentials?: string[]
  attributes?: string[]
  timestamp: string
  details?: string
  status?: string
}

export interface BiometricData {
  id: string
  type: "fingerprint" | "faceId" | "voiceprint"
  registered: boolean
  registeredAt?: string
  lastUsed?: string
}

export interface DocumentVerification {
  id: string
  type: "passport" | "nationalId" | "driversLicense" | "other"
  documentNumber?: string
  issuingCountry?: string
  issuingAuthority?: string
  issueDate?: string
  expiryDate?: string
  verified: boolean
  verificationDate?: string
  status: "pending" | "verified" | "rejected"
}

export interface ZkpProof {
  id: string
  type: string
  credentialId: string
  attributes: string[]
  proofValue: string
  created: string
  expires?: string
  verified?: boolean
}

export interface BackupData {
  timestamp: string
  encryptedData: string
  method: "local" | "cloud" | "recovery"
  size: number
}

export type Credential = VerifiableCredential
