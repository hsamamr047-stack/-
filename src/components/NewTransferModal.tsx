import React, { useState, useEffect } from 'react';
import { BankAccount, User } from '../types';
import {
  COUNTRY_TRANSFER_METHODS,
  TRANSFER_CATEGORIES,
} from '../data/transferMethods';
import {
  Upload,
  Sparkles,
  FileText,
  DollarSign,
  User as UserIcon,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  ScanLine,
  Globe,
  Wallet,
  Phone,
  Landmark,
} from 'lucide-react';

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  selectedAccount?: BankAccount | null;
  currentUser: User | null;
  initialAmount?: number;
  initialCurrency?: string;
  onTransferCreated: () => void;
}

export const NewTransferModal: React.FC<NewTransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  selectedAccount,
  currentUser,
  initialAmount,
  initialCurrency,
  onTransferCreated,
}) => {
  const defaultBank = selectedAccount || accounts[0] || null;

  const [bankAccountId, setBankAccountId] = useState(defaultBank?.id || 'bank-central');
  const [grossAmount, setGrossAmount] = useState<number>(initialAmount || 10000);
  const [rawAmountString, setRawAmountString] = useState<string>(String(initialAmount || 10000));
  const [currency, setCurrency] = useState(initialCurrency || defaultBank?.currency || 'USD');

  // Convert Arabic/Eastern digits to English numbers 0-9
  const normalizeToEnglishDigits = (str: string) => {
    const arabicEasternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let res = str;
    arabicEasternDigits.forEach((d, idx) => {
      res = res.replaceAll(d, String(idx % 10));
    });
    return res.replace(/[^0-9.]/g, '');
  };

  // Country & Method selectors
  const [beneficiaryCountry, setBeneficiaryCountry] = useState('مصر');
  const [transferCategory, setTransferCategory] = useState<'wallet' | 'mobile' | 'bank_exchange'>('wallet');
  const [transferMethod, setTransferMethod] = useState('فودافون كاش');
  const [accountOrPhone, setAccountOrPhone] = useState('');

  const [senderName, setSenderName] = useState('طارق القحطاني');
  const [senderPhone, setSenderPhone] = useState('+966 50 123 4567');
  const [beneficiaryName, setBeneficiaryName] = useState('شركة المشرق للتجارة');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('+20 10 1234 5678');

  const [receiptUrl, setReceiptUrl] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
  );
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current country configuration
  const currentCountryConfig = COUNTRY_TRANSFER_METHODS.find(
    (c) => c.country === beneficiaryCountry
  ) || COUNTRY_TRANSFER_METHODS[0];

  // Available methods for current country and category
  const availableMethods = currentCountryConfig.methods.filter(
    (m) => m.category === transferCategory || transferCategory === 'bank_exchange'
  );

  // When beneficiary country changes, pick first available method
  useEffect(() => {
    const config = COUNTRY_TRANSFER_METHODS.find((c) => c.country === beneficiaryCountry);
    if (config && config.methods.length > 0) {
      setTransferMethod(config.methods[0].name);
      setTransferCategory(config.methods[0].category);
    }
  }, [beneficiaryCountry]);

  if (!isOpen) return null;

  const activeBank = accounts.find((b) => b.id === bankAccountId) || defaultBank;

  // Financial calculations
  const brokerPct = 10;
  const agentPct = 10;
  const brokerFee = Math.round((grossAmount * (brokerPct / 100)) * 100) / 100;
  const agentFee = Math.round((grossAmount * (agentPct / 100)) * 100) / 100;
  const totalCommissions = brokerFee + agentFee;
  const netAmount = Math.max(0, Math.round((grossAmount - totalCommissions) * 100) / 100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReceiptUrl(result);
      setReceiptBase64(result);
      setScanMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScanWithGemini = async () => {
    if (!receiptBase64) {
      setScanMessage('يرجى تحميل صورة إيصال أولاً لتشغيل الفحص بالذكاء الاصطناعي.');
      return;
    }

    setScanning(true);
    setScanMessage(null);

    try {
      const res = await fetch('/api/gemini/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: receiptBase64,
          mimeType: 'image/jpeg',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.amount) setGrossAmount(Number(json.data.amount));
        if (json.data.currency) setCurrency(json.data.currency);
        if (json.data.senderName) setSenderName(json.data.senderName);
        setScanMessage('✅ تم استخراج بيانات الإيصال تلقائياً بواسطة جميناي AI!');
      } else {
        setScanMessage('تعذر الفحص، يرجى ملء البيانات يدوياً.');
      }
    } catch (e) {
      setScanMessage('حدث خطأ أثناء فحص الإيصال بالذكاء الاصطناعي.');
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: currentUser?.id || 'usr-agent-01',
          agentName: currentUser?.name || 'المدير الحسام',
          agentCode: currentUser?.agentCode || 'QH-AG-100',
          brokerName: 'مجموعة الحسام الوسيطة',
          bankAccountId: activeBank?.id,
          grossAmount,
          currency,
          senderName,
          senderPhone,
          beneficiaryName,
          beneficiaryCountry,
          beneficiaryPhone,
          transferCategory,
          transferMethod,
          accountOrPhone,
          receiptUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onTransferCreated();
        onClose();
      } else {
        setError(data.error || 'فشل إرسال طلب التحويل.');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم لإرسال الطلب.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0a0f1e]/90 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              New Transfer Workflow
            </span>
            <h3 className="text-lg font-bold text-amber-200 mt-1">
              إصدار طلب تحويل جديد ورفع إيصال
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-slate-400 hover:text-slate-100 flex items-center justify-center transition border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-right">
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Target Bank Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              اختيار الحساب البنكي الدولي المودع فيه
            </label>
            <select
              value={bankAccountId}
              onChange={(e) => {
                setBankAccountId(e.target.value);
                const b = accounts.find((acc) => acc.id === e.target.value);
                if (b) setCurrency(b.currency);
              }}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-amber-300 text-xs font-bold focus:border-amber-400 focus:outline-none"
            >
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.countryFlag} {acc.bankName} - {acc.country} ({acc.currency}) | الآيبان: {acc.iban.substring(0, 16)}...
                  </option>
                ))
              ) : (
                <option value="bank-central">🌐 حساب الإدارة المركزي (توجيه تلقائي للمراجعة)</option>
              )}
            </select>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                المبلغ الإجمالي المحول (Gross Amount)
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={rawAmountString}
                onChange={(e) => {
                  const clean = normalizeToEnglishDigits(e.target.value);
                  setRawAmountString(clean);
                  const num = parseFloat(clean);
                  setGrossAmount(isNaN(num) ? 0 : num);
                }}
                placeholder="1000"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-amber-300 font-bold font-mono text-base focus:border-amber-400 focus:outline-none"
                dir="ltr"
              />
              <p className="text-[10px] text-amber-400/80 mt-1">
                💡 يُقبل الإدخال بالأرقام الإنجليزية فقط (0-9)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                عملة التحويل
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-bold text-xs"
              >
                <option value="USD">USD ($) دولار أمريكي</option>
                <option value="EUR">EUR (€) يورو أوروبي</option>
                <option value="SAR">SAR (ر.س) ريال سعودي</option>
                <option value="AED">AED (د.إ) درهم إماراتي</option>
                <option value="TRY">TRY (₺) ليرة تركية</option>
              </select>
            </div>
          </div>

          {/* Financial Breakdown Summary Banner */}
          <div className="p-4 bg-black/40 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">خصم عمولة الوسيط المالي (10%):</span>
              <span className="font-mono font-bold text-amber-400">-{brokerFee.toLocaleString()} {currency}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">خصم عمولة وكيل التحويل (10%):</span>
              <span className="font-mono font-bold text-amber-300">-{agentFee.toLocaleString()} {currency}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold">
              <span className="text-emerald-400">المبلغ الصافي النهائي للتسليم:</span>
              <span className="font-mono text-emerald-300 text-base">{netAmount.toLocaleString()} {currency}</span>
            </div>
          </div>

          {/* Receipt Upload & Gemini OCR Scan Zone */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                صورة إيصال التحويل المرفقة
              </label>

              <button
                type="button"
                onClick={handleScanWithGemini}
                disabled={scanning}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 transition flex items-center gap-1.5 shadow"
              >
                {scanning ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                فحص الإيصال بالذكاء الاصطناعي (Gemini OCR)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-amber-300 hover:file:bg-white/20 cursor-pointer"
              />

              {receiptUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-amber-500/40 relative group shrink-0">
                  <img src={receiptUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {scanMessage && (
              <p className="text-xs text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                {scanMessage}
              </p>
            )}
          </div>

          {/* Country & Transfer Method Selector Section */}
          <div className="p-4 bg-black/50 rounded-2xl border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              تحديد الدولة وطريقة التحويل المعتمدة (International Transfer)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  1. الدولة المستهدفة للتحويل
                </label>
                <select
                  value={beneficiaryCountry}
                  onChange={(e) => setBeneficiaryCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-300 text-xs font-bold focus:outline-none"
                >
                  {COUNTRY_TRANSFER_METHODS.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.flag} {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  2. نوع طريقة التحويل
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {TRANSFER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTransferCategory(cat.id)}
                      className={`p-2 rounded-lg text-[10px] font-bold text-center transition ${
                        transferCategory === cat.id
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  3. خيار طريقة الدفع لـ ({beneficiaryCountry})
                </label>
                <select
                  value={transferMethod}
                  onChange={(e) => setTransferMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-emerald-400 text-xs font-bold focus:outline-none"
                >
                  {currentCountryConfig.methods.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.category === 'wallet' ? 'محفظة' : m.category === 'mobile' ? 'جوال' : 'بنك / صراف'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  4. رقم المحفظة / الجوال / الحساب البنكي
                </label>
                <input
                  type="text"
                  required
                  value={accountOrPhone}
                  onChange={(e) => setAccountOrPhone(e.target.value)}
                  placeholder="أدخل رقم الحساب أو المحفظة هنا..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Sender & Beneficiary Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-400">بيانات المحول (المرسل)</h4>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">اسم المرسل الثلاثي</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">رقم هاتف المرسل</label>
                <input
                  type="text"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400">بيانات المستفيد (المرسل إليه)</h4>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">اسم المستفيد / الشركة</label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">هاتف المستفيد</label>
                <input
                  type="text"
                  required
                  value={beneficiaryPhone}
                  onChange={(e) => setBeneficiaryPhone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-slate-300 text-xs font-bold hover:bg-white/20 border border-white/10"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  إرسال الطلب للمراجعة والتدقيق
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
