import React, { useState, useEffect } from 'react';
import { User, BankAccount, TransferOrder, ArchivedInvoice, Message, SystemStats } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LuxuryBanner } from './components/LuxuryBanner';
import { AccountsHub } from './components/AccountsHub';
import { FinancialCalculator } from './components/FinancialCalculator';
import { TransferWorkflow } from './components/TransferWorkflow';
import { ArchivedInvoices } from './components/ArchivedInvoices';
import { MessagingHub } from './components/MessagingHub';
import { UserManagement } from './components/UserManagement';
import { UserProfile } from './components/UserProfile';
import { BottomNav } from './components/BottomNav';
import { LoginModal } from './components/LoginModal';
import { NewTransferModal } from './components/NewTransferModal';
import { INITIAL_USERS } from './data/initialData';

export default function App() {
  // Current user initialization: check localStorage or default to Super Admin
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('qutaina_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_USERS[0];
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // State collections
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transfers, setTransfers] = useState<TransferOrder[]>([]);
  const [invoices, setInvoices] = useState<ArchivedInvoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalTransfersCount: 0,
    totalGrossVolumeUSD: 0,
    totalNetVolumeUSD: 0,
    totalCommissionsUSD: 0,
    pendingCount: 0,
    deliveredCount: 0,
    archivedInvoicesCount: 0,
    activeAccountsCount: 0,
  });

  // Modal controls
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [preselectedAccount, setPreselectedAccount] = useState<BankAccount | null>(null);
  const [transferInitialAmount, setTransferInitialAmount] = useState<number | undefined>(undefined);
  const [transferInitialCurrency, setTransferInitialCurrency] = useState<string | undefined>(undefined);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Helper function for safe API fetching without JSON parsing errors
  const safeFetchJson = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return await res.json();
      }
      return { success: false, error: `Response not valid JSON (HTTP ${res.status})` };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  // Fetch server data
  const fetchData = async () => {
    try {
      const [accData, trfData, invData, msgData, usrData, stData] = await Promise.all([
        safeFetchJson('/api/accounts'),
        safeFetchJson('/api/transfers'),
        safeFetchJson('/api/invoices'),
        safeFetchJson('/api/messages'),
        safeFetchJson('/api/users'),
        safeFetchJson('/api/stats'),
      ]);

      if (accData?.success) setBankAccounts(accData.accounts);
      if (trfData?.success) setTransfers(trfData.transfers);
      if (invData?.success) setInvoices(invData.invoices);
      if (msgData?.success) setMessages(msgData.messages);
      if (usrData?.success) setUsers(usrData.users);
      if (stData?.success) setStats(stData.stats);
    } catch (err) {
      console.error('Error loading data from Express API:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Polling for real-time updates
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('qutaina_user');
    setCurrentUser(null);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem('qutaina_user', JSON.stringify(user));
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleOpenTransferWithAccount = (acc: BankAccount) => {
    setPreselectedAccount(acc);
    setTransferInitialAmount(undefined);
    setTransferInitialCurrency(acc.currency);
    setShowNewTransferModal(true);
  };

  const handleStartTransferFromCalc = (amount: number, currency: string) => {
    setPreselectedAccount(null);
    setTransferInitialAmount(amount);
    setTransferInitialCurrency(currency);
    setShowNewTransferModal(true);
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: 'processing' | 'delivered' | 'rejected',
    rejectionReason?: string
  ) => {
    try {
      const data = await safeFetchJson(`/api/transfers/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (data?.success) {
        fetchData();
        if (status === 'delivered') {
          setActiveTab('invoices');
        }
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleSendMessage = async (msg: {
    content: string;
    type: 'text' | 'image' | 'audio';
    mediaUrl?: string;
    audioDuration?: number;
    transferOrderId?: string;
  }) => {
    try {
      const data = await safeFetchJson('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...msg,
          senderId: currentUser?.id || 'usr-admin-01',
          senderName: currentUser?.name || 'حسام عمرو - المدير العام',
          senderRole: currentUser?.role || 'super_admin',
        }),
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  const handleAddAccount = async (newAcc: Partial<BankAccount>) => {
    try {
      const data = await safeFetchJson('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAcc),
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to add account:', e);
    }
  };

  const handleEditAccount = async (id: string, updatedAcc: Partial<BankAccount>) => {
    try {
      const data = await safeFetchJson(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAcc),
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to edit account:', e);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const data = await safeFetchJson(`/api/accounts/${id}`, {
        method: 'DELETE',
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to delete account:', e);
    }
  };

  const handleAddUser = async (newUser: Partial<User>) => {
    try {
      const data = await safeFetchJson('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to add user:', e);
    }
  };

  const handleToggleUserActive = async (userId: string) => {
    try {
      const data = await safeFetchJson(`/api/users/${userId}/toggle`, {
        method: 'PATCH',
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to toggle user:', e);
    }
  };

  const handleEditUser = async (id: string, updatedUser: Partial<User>) => {
    try {
      const data = await safeFetchJson(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to edit user:', e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const data = await safeFetchJson(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (data?.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Failed to delete user:', e);
    }
  };

  const pendingCount = transfers.filter((t) => t.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden" dir="rtl">
      
      {/* Frosted Glass Background Ambient Blur Orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed -bottom-40 left-1/3 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        {/* Header */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => setShowLoginModal(true)}
          pendingOrdersCount={pendingCount}
          unreadMessagesCount={unreadMessagesCount}
          onSelectTab={setActiveTab}
        />

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser?.role}
          pendingCount={pendingCount}
          onOpenNewTransfer={() => {
            setPreselectedAccount(null);
            setShowNewTransferModal(true);
          }}
        />

        {/* Content Body Area */}
        <main className="flex-1 space-y-6">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <LuxuryBanner
                stats={stats}
                currentUser={currentUser}
                onSelectTab={setActiveTab}
                onOpenNewTransfer={() => {
                  setPreselectedAccount(null);
                  setShowNewTransferModal(true);
                }}
              />
              
              {/* Financial Engine Calculator Section */}
              <FinancialCalculator onStartTransferWithAmount={handleStartTransferFromCalc} />

              {/* Order Workflow Board */}
              <TransferWorkflow
                transfers={transfers}
                currentUser={currentUser}
                onUpdateStatus={handleUpdateStatus}
                onViewInvoice={(invId) => {
                  setSelectedInvoiceId(invId);
                  setActiveTab('invoices');
                }}
                onOpenNewTransfer={() => {
                  setPreselectedAccount(null);
                  setShowNewTransferModal(true);
                }}
              />
            </div>
          )}

          {activeTab === 'accounts' && (
            <AccountsHub
              accounts={bankAccounts}
              currentUser={currentUser}
              onOpenTransferModalWithAccount={handleOpenTransferWithAccount}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {activeTab === 'calculator' && (
            <FinancialCalculator onStartTransferWithAmount={handleStartTransferFromCalc} />
          )}

          {activeTab === 'orders' && (
            <TransferWorkflow
              transfers={transfers}
              currentUser={currentUser}
              onUpdateStatus={handleUpdateStatus}
              onViewInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setActiveTab('invoices');
              }}
              onOpenNewTransfer={() => {
                setPreselectedAccount(null);
                setShowNewTransferModal(true);
              }}
            />
          )}

          {activeTab === 'invoices' && (
            <ArchivedInvoices invoices={invoices} initialSelectedId={selectedInvoiceId} />
          )}

          {activeTab === 'messages' && (
            <MessagingHub
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfile
              currentUser={currentUser}
              onSelectTab={setActiveTab}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'users' && (currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.email === 'hsamamr047@gmail.com') && (
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleUserActive={handleToggleUserActive}
            />
          )}

        </main>

      </div>

      {/* Persistent Bottom Navigation Bar (5 core tabs) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewTransfer={() => {
          setPreselectedAccount(null);
          setShowNewTransferModal(true);
        }}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal || !currentUser}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        isRouteGuard={!currentUser}
      />

      {/* New Transfer Modal */}
      <NewTransferModal
        isOpen={showNewTransferModal}
        onClose={() => setShowNewTransferModal(false)}
        accounts={bankAccounts}
        selectedAccount={preselectedAccount}
        currentUser={currentUser}
        initialAmount={transferInitialAmount}
        initialCurrency={transferInitialCurrency}
        onTransferCreated={() => {
          fetchData();
          setActiveTab('orders');
        }}
      />

      </div>
    </div>
  );
}
