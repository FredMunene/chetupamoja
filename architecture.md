# Minimal Base ETH Donation Platform Architecture

## Project Structure

```
base-donation-platform/
├── src/
│   ├── app/                      # Next.js 13+ App Router
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── donate/
│   │       └── [orgId]/
│   │           └── page.tsx      # Dynamic donation page
│   │
│   ├── components/               # React components
│   │   ├── DonationForm.tsx      # Main donation form
│   │   ├── QRCodeDisplay.tsx     # QR code generator
│   │   ├── TransactionStatus.tsx # Real-time tx status
│   │   └── DonationTracker.tsx   # Live donation counter
│   │
│   ├── lib/                      # Utilities and services
│   │   ├── web3.ts              # Web3 connection logic
│   │   ├── base-network.ts      # Base network config
│   │   ├── donation-service.ts  # Donation processing
│   │   └── db.ts                # Database connection
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useWallet.ts         # Wallet connection
│   │   ├── useDonation.ts       # Donation state
│   │   └── useRealTime.ts       # Live updates
│   │
│   └── types/                    # TypeScript definitions
│       ├── donation.ts          # Donation interfaces
│       └── organization.ts      # Organization types
│
├── public/                       # Static assets
│   └── organizations/           # Org logos/assets
│
├── prisma/                      # Database schema
│   ├── schema.prisma           # Database models
│   └── migrations/             # DB migrations
│
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── package.json               # Dependencies
└── tailwind.config.js         # Tailwind CSS config
```

## Core Components & Responsibilities

### 1. **App Router Structure**
```typescript
// src/app/donate/[orgId]/page.tsx
export default function DonationPage({ params }: { params: { orgId: string } }) {
  return <DonationForm organizationId={params.orgId} />
}
```

**What it does:**
- Dynamic routing for each organization
- Server-side rendering for SEO
- Handles organization-specific branding

### 2. **Main Components**

#### `DonationForm.tsx`
```typescript
interface DonationFormProps {
  organizationId: string;
}

// Manages: amount input, wallet connection, transaction flow
```

**State it manages:**
- Donation amount (ETH)
- USD equivalent
- Transaction status
- Form validation

#### `QRCodeDisplay.tsx` 
```typescript
interface QRCodeProps {
  walletAddress: string;
  amount: string;
  onTransactionDetected: (txHash: string) => void;
}

// Generates QR code for mobile wallet scanning
```

#### `TransactionStatus.tsx`
```typescript
// Real-time transaction monitoring
// Shows: pending → confirmed → completed states
```

### 3. **Services Layer**

#### `lib/web3.ts`
```typescript
// Web3 connection and Base network setup
export const baseConfig = {
  chainId: 8453,
  rpcUrl: 'https://mainnet.base.org',
  explorer: 'https://basescan.org'
}

export function connectToBase(): Web3Provider
export function getETHBalance(address: string): Promise<string>
```

#### `lib/donation-service.ts`
```typescript
export interface DonationData {
  amount: string;
  txHash: string;
  organizationId: string;
  timestamp: Date;
}

export function processDonation(data: DonationData): Promise<void>
export function trackTransaction(txHash: string): Promise<TransactionStatus>
```

#### `lib/base-network.ts`
```typescript
// Base-specific network utilities
export function isValidBaseAddress(address: string): boolean
export function getBaseTransactionFee(): Promise<string>
export function monitorBaseTransaction(txHash: string): Promise<Receipt>
```

### 4. **State Management**

#### Global State (React Context)
```typescript
// src/contexts/DonationContext.tsx
interface DonationState {
  currentDonation: DonationData | null;
  transactions: Transaction[];
  isConnected: boolean;
  walletAddress: string | null;
}
```

#### Local Component State
```typescript
// Individual components use useState for:
// - Form inputs (amount, anonymous checkbox)
// - UI states (loading, error messages)
// - Transaction progress
```

### 5. **Custom Hooks**

#### `useWallet.ts`
```typescript
export function useWallet() {
  return {
    address: string | null,
    isConnected: boolean,
    connect: () => Promise<void>,
    disconnect: () => void,
    balance: string
  }
}
```

#### `useDonation.ts`
```typescript
export function useDonation(organizationId: string) {
  return {
    submitDonation: (amount: string) => Promise<string>, // returns txHash
    donationStatus: 'idle' | 'pending' | 'confirmed' | 'failed',
    totalRaised: string,
    donationCount: number
  }
}
```

#### `useRealTime.ts`
```typescript
// WebSocket connection for live updates
export function useRealTime(organizationId: string) {
  return {
    liveDonations: Donation[],
    totalRaised: string,
    isConnected: boolean
  }
}
```

### 6. **Database Schema**

```prisma
// prisma/schema.prisma
model Organization {
  id          String     @id @default(cuid())
  name        String
  walletAddress String   @unique
  donations   Donation[]
  createdAt   DateTime   @default(now())
}

model Donation {
  id             String       @id @default(cuid())
  amount         String       // ETH amount as string
  usdValue       String       // USD equivalent at time of donation
  txHash         String       @unique
  status         String       // pending, confirmed, failed
  anonymous      Boolean      @default(false)
  message        String?      // Optional donor message
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}
```

## Data Flow

### 1. **Donation Process**
```
User visits /donate/[orgId] 
→ Page loads organization data (SSR)
→ DonationForm renders with org wallet address
→ User enters amount → QR code generated
→ User scans QR → sends transaction from wallet
→ useRealTime hook detects transaction
→ Database updated → UI shows confirmation
```

### 2. **Real-time Updates**
```
Transaction sent → Base network confirms
→ Webhook/polling detects confirmation
→ WebSocket broadcasts to all connected clients
→ UI updates donation counter and recent donations
```

### 3. **State Flow**
```
Component State (forms, UI) 
→ Custom Hooks (business logic)
→ Services (API calls, Web3 interactions)
→ Database (persistent storage)
→ Real-time Updates (WebSocket)
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
DATABASE_URL=
NEXTAUTH_SECRET=
WEBHOOK_SECRET=
```

## API Routes

```typescript
// src/app/api/donations/route.ts
POST /api/donations          # Create new donation record
GET  /api/donations/[orgId]  # Get donations for organization

// src/app/api/webhooks/base/route.ts  
POST /api/webhooks/base      # Base network transaction webhooks

// src/app/api/organizations/[id]/route.ts
GET /api/organizations/[id]  # Get organization details
```

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "ethers": "^6.0.0",
    "wagmi": "^1.0.0",
    "@tanstack/react-query": "^4.0.0",
    "prisma": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "qrcode": "^1.5.0",
    "socket.io-client": "^4.0.0"
  }
}
```

## Deployment Strategy

### **Phase 1: Core MVP**
- Single organization donation page
- Base ETH only
- Basic transaction tracking

### **Phase 2: Multi-org**
- Dynamic organization onboarding
- Admin dashboard
- Enhanced analytics

### **Phase 3: Advanced Features**
- Multiple cryptocurrencies
- Recurring donations
- NFT rewards for donors

This architecture prioritizes simplicity while maintaining scalability for future features.