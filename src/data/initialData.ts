import { User, BankAccount, TransferOrder, ArchivedInvoice, Message } from '../types';

// Clean Database Initial Users: Super Admin only
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'المدير الحسام',
    email: 'hsamamr047@gmail.com',
    password: '778915hhhh',
    role: 'super_admin',
    agentCode: 'QH-ADMIN-01',
    phone: '+966 50 123 4567',
    brokerCommissionPct: 10,
    agentCommissionPct: 10,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: '2026-08-10T12:00:00Z',
  }
];

// Clean empty collections
export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [];

export const INITIAL_TRANSFERS: TransferOrder[] = [];

export const INITIAL_INVOICES: ArchivedInvoice[] = [];

export const INITIAL_MESSAGES: Message[] = [];
