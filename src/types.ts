export type UserRole = 'super_admin' | 'admin' | 'agent' | 'broker' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  agentCode: string;
  phone: string;
  brokerCommissionPct: number; // default 10%
  agentCommissionPct: number;  // default 10%
  active: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  country: string;
  countryCode: string; // ISO e.g. TR, SA, AE, DE, GB, US
  countryFlag: string; // Emoji or SVG path
  accountHolder: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  currency: string;
  dailyLimit: number;
  currentSpent: number;
  active: boolean;
  notes?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'rejected';

export interface TransferOrder {
  id: string;
  serialNumber: string; // e.g. QH-2026-1042
  agentId: string;
  agentName: string;
  agentCode: string;
  brokerName?: string;
  bankAccountId: string;
  bankName: string;
  iban: string;
  grossAmount: number;
  currency: string;
  brokerCommissionPct: number;  // 10%
  brokerCommissionAmount: number;
  agentCommissionPct: number;   // 10%
  agentCommissionAmount: number;
  totalCommissions: number;
  netAmount: number;
  senderName: string;
  senderPhone: string;
  beneficiaryName: string;
  beneficiaryCountry: string;
  beneficiaryPhone: string;
  transferCategory?: string;
  transferMethod?: string;
  accountOrPhone?: string;
  status: OrderStatus;
  receiptUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  invoiceId?: string;
  notes?: string;
}

export interface ArchivedInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-QH-2026-8821
  transferOrderId: string;
  serialNumber: string;
  issuedAt: string;
  agentName: string;
  agentCode: string;
  brokerName: string;
  bankName: string;
  iban: string;
  grossAmount: number;
  brokerCommissionAmount: number;
  agentCommissionAmount: number;
  totalCommissions: number;
  netAmount: number;
  currency: string;
  senderName: string;
  beneficiaryName: string;
  beneficiaryCountry: string;
  transferCategory?: string;
  transferMethod?: string;
  accountOrPhone?: string;
  verified: boolean;
  digitalSignature: string;
}

export type MessageType = 'text' | 'image' | 'audio';

export interface Message {
  id: string;
  transferOrderId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId?: string; // empty if public/system channel
  content: string;
  type: MessageType;
  mediaUrl?: string;
  audioDuration?: number; // seconds
  timestamp: string;
  read: boolean;
}

export interface SystemStats {
  totalTransfersCount: number;
  totalGrossVolumeUSD: number;
  totalNetVolumeUSD: number;
  totalCommissionsUSD: number;
  pendingCount: number;
  deliveredCount: number;
  archivedInvoicesCount: number;
  activeAccountsCount: number;
}

export interface ScanReceiptResponse {
  success: boolean;
  data?: {
    amount?: number;
    currency?: string;
    bankName?: string;
    iban?: string;
    senderName?: string;
    date?: string;
    transactionRef?: string;
  };
  rawAnalysis?: string;
  error?: string;
}
