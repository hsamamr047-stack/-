import React, { useState } from 'react';
import { BankAccount, User } from '../types';
import {
  Copy,
  Check,
  Upload,
  Landmark,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface AccountsHubProps {
  accounts: BankAccount[];
  currentUser: User | null;
  onOpenTransferModalWithAccount: (account: BankAccount) => void;
  onAddAccount: (newAcc: Partial<BankAccount>) => void;
  onEditAccount?: (id: string, updatedAcc: Partial<BankAccount>) => void;
  onDeleteAccount?: (id: string) => void;
}

export const AccountsHub: React.FC<AccountsHubProps> = ({
  accounts,
  currentUser,
  onOpenTransferModalWithAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Form states (shared for create/edit)
  const [bankName, setBankName] = useState('');
  const [country, setCountry] = useState('');
  const [countryFlag, setCountryFlag] = useState('🇸🇦');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [dailyLimit, setDailyLimit] = useState('250000');
  const [notes, setNotes] = useState('');

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.email === 'hsamamr047@gmail.com';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openAddModal = () => {
    setBankName('');
    setCountry('');
    setCountryFlag('🇸🇦');
    setAccountHolder('');
    setAccountNumber('');
    setIban('');
    setSwiftCode('');
    setCurrency('USD');
    setDailyLimit('250000');
    setNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (acc: BankAccount) => {
    setEditingAccount(acc);
    setBankName(acc.bankName);
    setCountry(acc.country);
    setCountryFlag(acc.countryFlag);
    setAccountHolder(acc.accountHolder);
    setAccountNumber(acc.accountNumber);
    setIban(acc.iban);
    setSwiftCode(acc.swiftCode || '');
    setCurrency(acc.currency);
    setDailyLimit(String(acc.dailyLimit));
    setNotes(acc.notes || '');
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAccount({
      bankName,
      country,
      countryFlag,
      accountHolder,
      accountNumber,
      iban,
      swiftCode,
      currency,
      dailyLimit: Number(dailyLimit) || 100000,
      notes,
    });
    setShowAddModal(false);
  };

  const handleEditAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount && onEditAccount) {
      onEditAccount(editingAccount.id, {
        bankName,
        country,
        countryFlag,
        accountHolder,
        accountNumber,
        iban,
        swiftCode,
        currency,
        dailyLimit: Number(dailyLimit) || 100000,
        notes,
      });
      setEditingAccount(null);
    }
  };

  const handleDelete = (acc: BankAccount) => {
    if (window.confirm(`هل أنت تأكد من حذف الحساب البنكي (${acc.bankName} - ${acc.country})؟`)) {
      if (onDeleteAccount) onDeleteAccount(acc.id);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountHolder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = currencyFilter === 'ALL' || acc.currency === currencyFilter;
    return matchesSearch && matchesCurrency;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              International Bank Vault
            </span>
            <span className="text-xs text-slate-400">إدارة حصرية للإدارة العامة</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-200">
            الحسابات البنكية الدولية المعتمدة
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            استعرض بيانات الحسابات المعتمدة لإجراء التحويلات، استخدم زر "النسخ السريع" للآيبان، أو أضف وعدّل أياً من الحسابات كمدير عام بكل سهولة.
          </p>
        </div>

        {isAdmin && (
          <button
            id="add-account-btn"
            onClick={openAddModal}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            إضافة حساب بنكي جديد
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم البنك، الدولة، أو رقم الآيبان..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-amber-400 focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'USD', 'SAR', 'AED', 'EUR', 'EGP', 'TRY'].map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrencyFilter(curr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currencyFilter === curr
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {curr === 'ALL' ? 'جميع العملات' : curr}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State for Clean Slate */}
      {filteredAccounts.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Landmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-amber-200">لا توجد حسابات بنكية مضافة حتى الآن</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            قاعدة البيانات نظيفة وخالية تماماً من البيانات التجريبية. بصفتك المدير العام، يمكنك إضافة الحسابات البنكية لأي دولة بكل سهولة واستقلالية.
          </p>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة أول حساب بنكي الآن
            </button>
          )}
        </div>
      )}

      {/* Accounts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAccounts.map((acc) => {
          const isCopied = copiedId === acc.id;

          return (
            <div
              key={acc.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl transition duration-300 relative group flex flex-col justify-between"
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-black/40 rounded-2xl border border-white/10 shadow">
                      {acc.countryFlag}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                        {acc.bankName}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {acc.country} ({acc.currency})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                      {acc.currency}
                    </span>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(acc)}
                          className="p-1.5 rounded-lg bg-white/10 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition"
                          title="تعديل الحساب"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(acc)}
                          className="p-1.5 rounded-lg bg-white/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                          title="حذف الحساب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 font-mono text-xs">
                  
                  {/* Account Holder */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-sans">اسم صاحب الحساب:</span>
                    <span className="font-bold text-slate-100 font-sans">{acc.accountHolder}</span>
                  </div>

                  {/* IBAN with Copy Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <div className="overflow-x-auto">
                      <span className="text-slate-400 font-sans block text-[10px]">الآيبان الدولي (IBAN):</span>
                      <span className="font-bold text-amber-300 tracking-wider text-xs sm:text-sm select-all">
                        {acc.iban}
                      </span>
                    </div>

                    <button
                      id={`copy-iban-btn-${acc.id}`}
                      onClick={() => handleCopy(acc.iban, acc.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                          : 'bg-white/10 text-amber-300 hover:bg-white/20 border border-white/10'
                      }`}
                      title="نسخ الآيبان للحافظة"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-slate-950" />
                          تم النسخ!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          نسخ الآيبان
                        </>
                      )}
                    </button>
                  </div>

                  {/* SWIFT / Account Number */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-sans block text-[10px]">رمز سويفت SWIFT:</span>
                      <span className="font-semibold text-slate-200">{acc.swiftCode || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans block text-[10px]">رقم الحساب المحلي:</span>
                      <span className="font-semibold text-slate-200">{acc.accountNumber}</span>
                    </div>
                  </div>

                </div>

                {acc.notes && (
                  <p className="text-[11px] text-slate-400 bg-black/20 p-2.5 rounded-xl mt-3 border border-white/10">
                    💡 {acc.notes}
                  </p>
                )}
              </div>

              {/* Action: Upload Receipt for this Bank */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-mono">
                  السقف اليومي: <span className="text-slate-200 font-bold">{acc.dailyLimit.toLocaleString()} {acc.currency}</span>
                </div>

                <button
                  id={`upload-receipt-btn-${acc.id}`}
                  onClick={() => onOpenTransferModalWithAccount(acc)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/10 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  رفع إيصال وإرسال طلب
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Bank Account Modal (Admin Only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-lg bg-[#0a0f1e]/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                إضافة حساب بنكي دولي جديد
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم البنك البارز</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="مثال: مصرف الراجحي / بنك مصر / الأهلي"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الدولة</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="السعودية / مصر / سوريا"
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">علم الدولة (Emoji)</label>
                  <input
                    type="text"
                    value={countryFlag}
                    onChange={(e) => setCountryFlag(e.target.value)}
                    placeholder="🇸🇦"
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs text-center focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم صاحب الحساب المعتمد</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="شركة قطينة والحسام العالمية"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الآيبان (IBAN) / الحساب</label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="SA03 8000 0482 ..."
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">رمز SWIFT</label>
                  <input
                    type="text"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    placeholder="RJBKSA22"
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">العملة</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="SAR">SAR (ر.س)</option>
                    <option value="EGP">EGP (ج.م)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="TRY">TRY (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">السقف اليومي</label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات توجيهية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات للإشارة لنوع التحويلات المستلمة..."
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs h-16 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  حفظ الحساب في النظام
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit Bank Account Modal (Admin Only) */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-lg bg-[#0a0f1e]/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                تعديل بيانات الحساب البنكي
              </h3>
              <button
                onClick={() => setEditingAccount(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditAccountSubmit} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم البنك</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الدولة</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">علم الدولة (Emoji)</label>
                  <input
                    type="text"
                    value={countryFlag}
                    onChange={(e) => setCountryFlag(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs text-center focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم صاحب الحساب</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الآيبان (IBAN)</label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">رمز SWIFT</label>
                  <input
                    type="text"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">العملة</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="SAR">SAR (ر.س)</option>
                    <option value="EGP">EGP (ج.م)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="TRY">TRY (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">السقف اليومي</label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات توجيهية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs h-16 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  تحديث الحساب
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
