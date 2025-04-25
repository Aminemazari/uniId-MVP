import type {
  User,
  Credential,
  VerificationRequest,
  ActivityLogEntry,
  MetaverseConnection,
  BiometricData,
  DocumentVerification,
  ZkpProof,
  BackupData,
  Issuer,
} from "./types"
import { getAccessLevel } from "./access-control"

// Mock Issuers
export const mockIssuers: Issuer[] = [
  {
    id: "issuer-1",
    did: "did:web:gov.example",
    name: "Government ID Authority",
    domain: "gov.example",
    logo: "/placeholder.svg?height=40&width=40",
    verified: true,
    category: "government",
    country: "US",
    publicKey: "mockPublicKey1",
    trustLevel: "verified",
  },
  {
    id: "issuer-2",
    did: "did:web:university.example",
    name: "University of Example",
    domain: "university.example",
    logo: "/placeholder.svg?height=40&width=40",
    verified: true,
    category: "education",
    country: "US",
    publicKey: "mockPublicKey2",
    trustLevel: "high",
  },
  {
    id: "issuer-3",
    did: "did:web:hospital.example",
    name: "Example Health System",
    domain: "hospital.example",
    logo: "/placeholder.svg?height=40&width=40",
    verified: true,
    category: "healthcare",
    country: "US",
    publicKey: "mockPublicKey3",
    trustLevel: "high",
  },
  {
    id: "issuer-4",
    did: "did:web:company.example",
    name: "Example Corporation",
    domain: "company.example",
    logo: "/placeholder.svg?height=40&width=40",
    verified: true,
    category: "employment",
    country: "US",
    publicKey: "mockPublicKey4",
    trustLevel: "medium",
  },
]

// Mock Credentials
export const mockCredentials: Credential[] = [
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "credential-1",
    type: ["VerifiableCredential", "IdentityCredential"],
    issuer: {
      id: "did:web:gov.example",
      name: "Government ID Authority",
      country: "US",
    },
    issuanceDate: "2025-01-15T00:00:00Z",
    expirationDate: "2035-01-15T00:00:00Z",
    credentialSubject: {
      id: "did:example:user1",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      nationality: "US",
      documentNumber: "ID12345678",
    },
    status: "active",
    category: "identity",
    trustLevel: "verified",
    display: {
      title: "National ID Card",
      description: "Government issued identification",
      backgroundColor: "#4338ca",
      textColor: "#ffffff",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "credential-2",
    type: ["VerifiableCredential", "DegreeCredential"],
    issuer: {
      id: "did:web:university.example",
      name: "University of Example",
      country: "US",
    },
    issuanceDate: "2024-05-20T00:00:00Z",
    credentialSubject: {
      id: "did:example:user1",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2024-05-15",
    },
    status: "active",
    category: "education",
    trustLevel: "high",
    display: {
      title: "University Degree",
      description: "Bachelor of Science in Computer Science",
      backgroundColor: "#0369a1",
      textColor: "#ffffff",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "credential-3",
    type: ["VerifiableCredential", "EmploymentCredential"],
    issuer: {
      id: "did:web:company.example",
      name: "Example Corporation",
      country: "US",
    },
    issuanceDate: "2024-02-10T00:00:00Z",
    credentialSubject: {
      id: "did:example:user1",
      position: "Software Engineer",
      startDate: "2024-02-01",
      employeeId: "EMP789012",
    },
    status: "active",
    category: "employment",
    trustLevel: "medium",
    display: {
      title: "Employment Verification",
      description: "Current employment status",
      backgroundColor: "#0891b2",
      textColor: "#ffffff",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "credential-4",
    type: ["VerifiableCredential", "VaccinationCredential"],
    issuer: {
      id: "did:web:hospital.example",
      name: "Example Health System",
      country: "US",
    },
    issuanceDate: "2023-11-05T00:00:00Z",
    credentialSubject: {
      id: "did:example:user1",
      vaccineType: "COVID-19",
      vaccineName: "Example Vaccine",
      dateAdministered: "2023-11-01",
      healthcareProvider: "Example Clinic",
    },
    status: "active",
    category: "healthcare",
    trustLevel: "high",
    display: {
      title: "Vaccination Record",
      description: "COVID-19 vaccination certificate",
      backgroundColor: "#0d9488",
      textColor: "#ffffff",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
]

// Mock Verification Requests
export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "request-1",
    requester: {
      name: "Airport Security",
      did: "did:web:airport.example",
      logo: "/placeholder.svg?height=40&width=40",
      country: "US",
    },
    requestedCredentials: ["IdentityCredential"],
    requestedAttributes: ["firstName", "lastName", "dateOfBirth", "nationality"],
    purpose: "Identity verification for international travel",
    expiresAt: "2025-04-25T15:30:00Z",
    status: "pending",
    crossBorder: true,
  },
  {
    id: "request-2",
    requester: {
      name: "Example Bank",
      did: "did:web:bank.example",
      logo: "/placeholder.svg?height=40&width=40",
    },
    requestedCredentials: ["IdentityCredential", "EmploymentCredential"],
    requestedAttributes: ["firstName", "lastName", "position", "startDate"],
    purpose: "Account opening verification",
    expiresAt: "2025-04-24T10:00:00Z",
    status: "pending",
    zkpRequired: true,
  },
]

// Mock Activity Log
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: "activity-1",
    type: "credential_issued",
    credential: "National ID Card",
    issuer: "Government ID Authority",
    timestamp: "2025-01-15T10:30:00Z",
    status: "success",
  },
  {
    id: "activity-2",
    type: "credential_shared",
    credential: "University Degree",
    verifier: "Example Corporation",
    timestamp: "2025-04-10T14:20:00Z",
    status: "success",
  },
  {
    id: "activity-3",
    type: "verification_request",
    requester: "Airport Security",
    credentials: ["National ID Card"],
    timestamp: "2025-04-20T09:15:00Z",
    status: "pending",
  },
  {
    id: "activity-4",
    type: "metaverse_connection",
    platform: "MetaWorld",
    attributes: ["name", "avatar"],
    timestamp: "2025-04-18T16:45:00Z",
    status: "active",
  },
  {
    id: "activity-5",
    type: "verification_status_change",
    details: "Document verification completed",
    timestamp: "2025-03-25T11:10:00Z",
    status: "verified",
  },
]

// Mock Metaverse Connections
export const mockMetaverseConnections: MetaverseConnection[] = [
  {
    id: "metaverse-1",
    name: "MetaWorld Avatar",
    platform: "MetaWorld",
    avatarId: "avatar-12345",
    connectedAt: "2025-04-18T16:45:00Z",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    sharedAttributes: ["name", "avatar"],
    expiresAt: "2026-04-18T16:45:00Z",
  },
  {
    id: "metaverse-2",
    name: "VirtualRealm Character",
    platform: "VirtualRealm",
    avatarId: "char-67890",
    connectedAt: "2025-03-10T13:20:00Z",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    sharedAttributes: ["name", "avatar", "preferences"],
    expiresAt: "2026-03-10T13:20:00Z",
  },
]

// Mock Biometric Data
export const mockBiometricData: BiometricData[] = [
  {
    id: "biometric-1",
    type: "fingerprint",
    registered: true,
    registeredAt: "2025-01-10T09:30:00Z",
    lastUsed: "2025-04-22T08:15:00Z",
  },
  {
    id: "biometric-2",
    type: "faceId",
    registered: true,
    registeredAt: "2025-01-12T14:45:00Z",
    lastUsed: "2025-04-22T08:15:00Z",
  },
]

// Mock Document Verification
export const mockDocumentVerification: DocumentVerification = {
  id: "document-1",
  type: "passport",
  documentNumber: "P12345678",
  issuingCountry: "US",
  issuingAuthority: "Department of State",
  issueDate: "2020-05-15",
  expiryDate: "2030-05-14",
  verified: true,
  verificationDate: "2025-01-15T10:30:00Z",
  status: "verified",
}

// Mock ZKP Proofs
export const mockZkpProofs: ZkpProof[] = [
  {
    id: "zkp-1",
    type: "AgeVerification",
    credentialId: "credential-1",
    attributes: ["dateOfBirth"],
    proofValue: "mockProofValue1",
    created: "2025-04-15T11:20:00Z",
    verified: true,
  },
  {
    id: "zkp-2",
    type: "EmploymentVerification",
    credentialId: "credential-3",
    attributes: ["position", "startDate"],
    proofValue: "mockProofValue2",
    created: "2025-04-18T09:45:00Z",
    verified: true,
  },
]

// Mock Backup Data
export const mockBackupData: BackupData = {
  timestamp: "2025-04-01T12:00:00Z",
  encryptedData: "mockEncryptedBackupData",
  method: "cloud",
  size: 1024,
}

// Mock Users with different access levels
export const mockUserLimited: User = {
  id: "user-1",
  did: "did:example:user1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profileImage: "/placeholder.svg?height=100&width=100",
  verificationStatus: "unverified",
  trustScore: 30,
  biometricRegistered: false,
  faceIdRegistered: false,
  documentVerified: false,
  keyPair: {
    privateKey: "mockPrivateKey1",
    publicKey: "mockPublicKey1",
  },
  settings: {
    useBiometrics: false,
    useZkp: false,
    offlineMode: false,
    notifications: true,
    privacyMode: false,
    language: "en",
    theme: "system",
    autoLock: 5,
    backupEnabled: false,
  },
  accessLevel: {
    level: "limited",
    features: {
      canShare: false,
      canVerify: true,
      offlineSupport: false,
      metaverseAccess: false,
      zkpSupport: false,
    },
  },
}

export const mockUserPartial: User = {
  id: "user-1",
  did: "did:example:user1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profileImage: "/placeholder.svg?height=100&width=100",
  verificationStatus: "partial",
  verificationDate: "2025-03-10T14:30:00Z",
  trustScore: 60,
  biometricRegistered: true,
  faceIdRegistered: true,
  documentVerified: false,
  keyPair: {
    privateKey: "mockPrivateKey1",
    publicKey: "mockPublicKey1",
  },
  settings: {
    useBiometrics: true,
    useZkp: false,
    offlineMode: true,
    notifications: true,
    privacyMode: true,
    language: "en",
    theme: "system",
    autoLock: 5,
    backupEnabled: true,
    lastBackupDate: "2025-04-01T12:00:00Z",
  },
  accessLevel: {
    level: "partial",
    features: {
      canShare: true,
      canVerify: true,
      offlineSupport: true,
      metaverseAccess: true,
      zkpSupport: false,
    },
  },
}

export const mockUser: User = {
  id: "user-1",
  did: "did:example:user1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profileImage: "/placeholder.svg?height=100&width=100",
  verificationStatus: "verified",
  verificationDate: "2025-01-15T10:30:00Z",
  trustScore: 90,
  biometricRegistered: true,
  faceIdRegistered: true,
  documentVerified: true,
  keyPair: {
    privateKey: "mockPrivateKey1",
    publicKey: "mockPublicKey1",
  },
  settings: {
    useBiometrics: true,
    useZkp: true,
    offlineMode: true,
    notifications: true,
    privacyMode: true,
    language: "en",
    theme: "system",
    autoLock: 5,
    backupEnabled: true,
    lastBackupDate: "2025-04-01T12:00:00Z",
  },
  accessLevel: getAccessLevel({
    id: "user-1",
    did: "did:example:user1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    profileImage: "/placeholder.svg?height=100&width=100",
    verificationStatus: "verified",
    verificationDate: "2025-01-15T10:30:00Z",
    trustScore: 90,
    biometricRegistered: true,
    faceIdRegistered: true,
    documentVerified: true,
    keyPair: {
      privateKey: "mockPrivateKey1",
      publicKey: "mockPublicKey1",
    },
    settings: {
      useBiometrics: true,
      useZkp: true,
      offlineMode: true,
      notifications: true,
      privacyMode: true,
      language: "en",
      theme: "system",
      autoLock: 5,
      backupEnabled: true,
      lastBackupDate: "2025-04-01T12:00:00Z",
    },
    accessLevel: {
      level: "full",
      features: {
        canShare: true,
        canVerify: true,
        offlineSupport: true,
        metaverseAccess: true,
        zkpSupport: true,
      },
    },
  }),
}
