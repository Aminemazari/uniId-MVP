see site :https://kzmof0h3f2ufl2md2dso.lite.vusercontent.net/

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git

### Installation

2. Install dependencies:
  
   npm install

   yarn install


### Running the Development Server


npm run dev
# or
yarn dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.


## 📁 Project Structure

\`\`\`
uniid-app/
├── app/                  # Next.js App Router
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard and credential management
│   ├── get-started/      # Onboarding flow
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                  # Utility functions and helpers
│   ├── crypto-utils.ts   # Cryptographic operations
│   ├── storage-utils.ts  # Local storage management
│   ├── credential-utils.ts # Credential handling
│   ├── zkp-utils.ts      # Zero-knowledge proof utilities
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
└── README.md             # Project documentation
\`\`\`

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: JWT, Biometric authentication
- **Cryptography**: Web Crypto API, Zero-Knowledge Proofs
- **Storage**: Local Storage, IndexedDB
- **State Management**: React Context API, React Hooks



## 🔒 Security Features

- End-to-end encryption for all stored credentials
- Zero-knowledge proofs for privacy-preserving verification
- Biometric authentication for secure access
- Selective disclosure controls
- No central storage of private keys or sensitive data


