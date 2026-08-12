import React, { useState } from 'react';
import { ArchivedInvoice } from '../types';
import { COUNTRY_TRANSFER_METHODS } from '../data/transferMethods';
import {
  FileText,
  ShieldCheck,
  Search,
  Printer,
  Download,
  QrCode,
  Building2,
  CheckCircle2,
  Check,
  Lock,
  Filter,
  Globe,
  RotateCcw,
} from 'lucide-react';

interface ArchivedInvoicesProps {
  invoices: ArchivedInvoice[];
  initialSelectedId?: string | null;
}

export const ArchivedInvoices: React.FC<ArchivedInvoicesProps> = ({
  invoices,
  initialSelectedId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  const [selectedInvoice, setSelectedInvoice] = useState<ArchivedInvoice | null>(
    invoices.find((i) => i.id === initialSelectedId) || null
  );

  // Extract all available methods for dropdown
  const allMethodsList = Array.from(
    new Set(
      COUNTRY_TRANSFER_METHODS.flatMap((c) => c.methods.map((m) => m.name))
    )
  );

  const filtered = invoices.filter((inv) => {
    // Search text match
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bankName.toLowerCase().includes(searchTerm.toLowerCase());

    // Country match
    const matchesCountry =
      selectedCountry === 'ALL' ||
      inv.beneficiaryCountry.toLowerCase() === selectedCountry.toLowerCase();

    // Method match
    const matchesMethod =
      selectedMethod === 'ALL' ||
      (inv.transferMethod && inv.transferMethod.toLowerCase() === selectedMethod.toLowerCase());

    return matchesSearch && matchesCountry && matchesMethod;
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Financial Audit Archive
          </span>
          <h2 className="text-2xl font-bold text-amber-200 mt-1">
            أرشيف الفواتير المعتمدة للتدقيق المالي
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            قاعدة بيانات مؤرشفة ومحمية بالفواتير الصادرة آلياً فور ضغط "تم التسليم". تتضمن الفاتورة ختماً رسمياً رقمياً ورمز QR ومطابقة لعمولات الوسيط والوكيل.
          </p>
        </div>

        <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-2xl text-right font-mono text-xs">
          <p className="text-slate-400">إجمالي الفواتير المؤرشفة:</p>
          <p className="text-lg font-bold text-emerald-400">{invoices.length} فاتورة</p>
        </div>
      </div>

      {/* Smart Search & Country / Method Filter Bar */}
      <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-amber-400" />
            نظام الفلترة المتقدم للفواتير والحوالات
          </h3>
          {(selectedCountry !== 'ALL' || selectedMethod !== 'ALL' || searchTerm !== '') && (
            <button
              onClick={() => {
                setSelectedCountry('ALL');
                setSelectedMethod('ALL');
                setSearchTerm('');
              }}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Text Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الفاتورة، التسلسلي، الوكيل، البنك..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-amber-400 focus:outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {/* Country Filter */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 text-xs font-bold focus:outline-none"
            >
              <option value="ALL">جميع الدول (كل الوجهات)</option>
              {COUNTRY_TRANSFER_METHODS.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.flag} {c.country}
                </option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold focus:outline-none"
            >
              <option value="ALL">جميع طرق التحويل</option>
              {allMethodsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition duration-300 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="font-mono text-xs font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                  {inv.invoiceNumber}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> مراجع ومؤرشف
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans text-slate-400">الوكيل:</span>
                  <span className="font-bold">{inv.agentName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans text-slate-400">الدولة والوجهة:</span>
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    {inv.beneficiaryCountry}
                  </span>
                </div>
                {inv.transferMethod && (
                  <div className="flex justify-between text-slate-300">
                    <span className="font-sans text-slate-400">طريقة الدفع:</span>
                    <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {inv.transferMethod}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans text-slate-400">البنك المودع:</span>
                  <span className="text-amber-300 font-bold">{inv.bankName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans text-slate-400">المستفيد:</span>
                  <span className="text-emerald-400 font-bold">{inv.beneficiaryName}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-between text-sm font-bold text-emerald-400">
                  <span className="font-sans text-slate-300">الصافي المحول:</span>
                  <span>{inv.netAmount.toLocaleString()} {inv.currency}</span>
                </div>
              </div>
            </div>

            <button
              id={`open-invoice-modal-btn-${inv.id}`}
              onClick={() => setSelectedInvoice(inv)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              معاينة الفاتورة الرسمية المعتمدة
            </button>
          </div>
        ))}
      </div>

      {/* Official Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
            
            {/* Modal Control Header (hidden on print) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Official Financial Invoice View
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> طباعة الفاتورة
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-slate-100 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Official Invoice Document */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-amber-500/30 space-y-6 print:bg-white print:text-black">
              
              {/* Official Document Brand Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-amber-500/40 pb-6 text-center sm:text-right">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center p-1">
                    <img
                      src="/src/assets/images/qutaina_husam_logo_1786391238778.jpg"
                      alt="Logo"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-amber-300">
                      شركة قطينة والحسام العالمية
                    </h1>
                    <p className="text-xs text-slate-400">لتحويلات المالية والدولية</p>
                    <p className="text-[10px] text-amber-400/80 font-mono">Qutaina & Al-Husam Global Transfers</p>
                  </div>
                </div>

                <div className="text-left font-mono text-xs space-y-1">
                  <p className="font-bold text-amber-300 text-sm">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-slate-400">التاريخ: {new Date(selectedInvoice.issuedAt).toLocaleDateString('ar-SA')}</p>
                  <p className="text-emerald-400 text-[10px]">الحالة: تم التسليم والأرشفة</p>
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-sans">الوكيل المعتمد:</span>
                  <span className="font-bold text-slate-100">{selectedInvoice.agentName} ({selectedInvoice.agentCode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">الوسيط المالي:</span>
                  <span className="font-bold text-slate-100">{selectedInvoice.brokerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">البنك المودع فيه:</span>
                  <span className="font-bold text-amber-300">{selectedInvoice.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">الآيبان الدولي المعتمد:</span>
                  <span className="font-bold text-slate-300 text-[10px]">{selectedInvoice.iban}</span>
                </div>
              </div>

              {/* Sender & Beneficiary */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">المرسل (Sender):</span>
                  <span className="font-bold text-slate-200">{selectedInvoice.senderName}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">المستفيد (Beneficiary):</span>
                  <span className="font-bold text-slate-200">{selectedInvoice.beneficiaryName} ({selectedInvoice.beneficiaryCountry})</span>
                </div>
              </div>

              {/* Financial Calculation Table */}
              <div className="border border-amber-500/30 rounded-xl overflow-hidden font-mono text-xs">
                <table className="w-full text-right">
                  <thead className="bg-slate-900 text-amber-300 border-b border-amber-500/30">
                    <tr>
                      <th className="p-3 font-sans">البيان المالي</th>
                      <th className="p-3 text-left">المبلغ بالعملة ({selectedInvoice.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    <tr>
                      <td className="p-3 font-sans">المبلغ الإجمالي المودع (Gross Amount)</td>
                      <td className="p-3 text-left font-bold text-slate-100">{selectedInvoice.grossAmount.toLocaleString()} {selectedInvoice.currency}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans text-amber-400">خصم عمولة الوسيط المالي (10%)</td>
                      <td className="p-3 text-left text-amber-400">-{selectedInvoice.brokerCommissionAmount.toLocaleString()} {selectedInvoice.currency}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans text-amber-300">خصم عمولة وكيل التحويل (10%)</td>
                      <td className="p-3 text-left text-amber-300">-{selectedInvoice.agentCommissionAmount.toLocaleString()} {selectedInvoice.currency}</td>
                    </tr>
                    <tr className="bg-emerald-950/40 text-emerald-300 font-bold text-sm">
                      <td className="p-3 font-sans">المبلغ الصافي النهائي المسلم (Net Payout)</td>
                      <td className="p-3 text-left">{selectedInvoice.netAmount.toLocaleString()} {selectedInvoice.currency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seal & Verification Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border-2 border-dashed border-amber-400 rounded-full flex flex-col items-center justify-center p-1 text-[8px] font-bold text-amber-400 text-center uppercase tracking-tighter">
                    <span>الختم المعتمد</span>
                    <span className="text-[7px] text-slate-300">قطينة والحسام</span>
                    <span>VERIFIED</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">التوقيع الرقمي المشفر:</p>
                    <p className="text-[10px] font-mono text-emerald-400 font-bold">{selectedInvoice.digitalSignature}</p>
                  </div>
                </div>

                <div className="text-center font-mono">
                  <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-700 mx-auto flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-950" />
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">رمز التحقق الآلي</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
