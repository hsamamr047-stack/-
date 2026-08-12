import React, { useState } from 'react';
import { TransferOrder, User } from '../types';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck2,
  FileText,
  Search,
  Filter,
  DollarSign,
  User as UserIcon,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from 'lucide-react';

interface TransferWorkflowProps {
  transfers: TransferOrder[];
  currentUser: User | null;
  onUpdateStatus: (orderId: string, status: 'processing' | 'delivered' | 'rejected', reason?: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  onOpenNewTransfer: () => void;
}

export const TransferWorkflow: React.FC<TransferWorkflowProps> = ({
  transfers,
  currentUser,
  onUpdateStatus,
  onViewInvoice,
  onOpenNewTransfer,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const filtered = transfers.filter((t) => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch =
      t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            قيد التنفيذ
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            تم التسليم
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            مرفوض
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Order Lifecycle Engine
          </span>
          <h2 className="text-2xl font-bold text-amber-200 mt-1">
            دورة حياة الطلبات والمعالجة الفورية
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            متابعة فورية لجميع الطلبات الصادرة من الوكلاء. يراجع المدير الطلب، ثم يضغط "تم التسليم" للتحويل التلقائي للفاتورة المعتمدة المؤرشفة للتدقيق المالي.
          </p>
        </div>

        <button
          onClick={onOpenNewTransfer}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
        >
          <ArrowLeftRight className="w-4 h-4" />
          إرسال طلب تحويل جديد
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالرقم التسلسلي، الوكيل، المرسل..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-amber-400 focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'جميع الطلبات' },
            { key: 'processing', label: 'قيد التنفيذ' },
            { key: 'delivered', label: 'تم التسليم' },
            { key: 'rejected', label: 'مرفوض' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterStatus === item.key
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transfers Grid / Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
            <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">لا توجد طلبات تحويل مطابقة في النظام</p>
            <p className="text-xs text-slate-400 mt-1">يمكنك إصدار طلب جديد أو تعديل خيارات البحث.</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Column: Order Meta */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-amber-300 text-sm bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                    {order.serialNumber}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-black/40 p-3 rounded-2xl border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px]">الوكيل مقدم الطلب:</span>
                    <span className="font-bold text-slate-200">{order.agentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">البنك المودع فيه:</span>
                    <span className="font-bold text-amber-300">{order.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">المستفيد الأخير:</span>
                    <span className="font-bold text-emerald-400">{order.beneficiaryName} ({order.beneficiaryCountry})</span>
                  </div>
                </div>

                {order.status === 'rejected' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>سبب الرفض المعتمد من الإدارة: {order.rejectionReason || 'لم يتم ذكر سبب الرفض'}</span>
                  </div>
                )}
              </div>

              {/* Middle Column: Financial Breakdown */}
              <div className="text-right font-mono text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-64">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>المبلغ الإجمالي:</span>
                  <span className="font-bold text-slate-100">{order.grossAmount.toLocaleString()} {order.currency}</span>
                </div>
                <div className="flex justify-between text-amber-400 text-[11px] mb-1">
                  <span>عمولات (10%+10%):</span>
                  <span>-{order.totalCommissions.toLocaleString()} {order.currency}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800">
                  <span>الصافي للتسليم:</span>
                  <span>{order.netAmount.toLocaleString()} {order.currency}</span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  id={`view-order-details-btn-${order.id}`}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowRejectInput(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  مراجعة الإيصال والبيانات
                </button>

                {order.status === 'delivered' && order.invoiceId && (
                  <button
                    id={`view-invoice-btn-${order.id}`}
                    onClick={() => onViewInvoice(order.invoiceId!)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    عرض الفاتورة المؤرشفة
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Order Review Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {selectedOrder.serialNumber}
                </span>
                <h3 className="text-lg font-bold text-amber-200">
                  تفاصيل الطلب ومطابقة الإيصال
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Receipt Preview */}
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold mb-2 block">إيصال التحويل المرفق</span>
                {selectedOrder.receiptUrl ? (
                  <a href={selectedOrder.receiptUrl} target="_blank" rel="noreferrer">
                    <img
                      src={selectedOrder.receiptUrl}
                      alt="إيصال التحويل"
                      className="w-full h-48 object-cover rounded-xl border border-slate-800 hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                ) : (
                  <div className="h-48 rounded-xl bg-slate-900 flex items-center justify-center text-xs text-slate-500">
                    لا تتوفر صورة إيصال
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
                <div>
                  <span className="text-slate-400 block text-[10px]">حالة الطلب الحالية:</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">الوكيل:</span>
                  <span className="font-bold text-slate-100">{selectedOrder.agentName} ({selectedOrder.agentCode})</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">الحساب البنكي:</span>
                  <span className="font-bold text-amber-300">{selectedOrder.bankName}</span>
                  <p className="font-mono text-[10px] text-slate-400">{selectedOrder.iban}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block text-[10px]">بيانات المرسل:</span>
                  <span className="font-bold text-slate-200">{selectedOrder.senderName} ({selectedOrder.senderPhone})</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">بيانات المستفيد:</span>
                  <span className="font-bold text-emerald-400">{selectedOrder.beneficiaryName} - {selectedOrder.beneficiaryCountry}</span>
                </div>
              </div>

            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>المبلغ الإجمالي الميداني:</span>
                <span className="font-bold text-slate-100">{selectedOrder.grossAmount.toLocaleString()} {selectedOrder.currency}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>خصم عمولة الوسيط (10%):</span>
                <span>-{selectedOrder.brokerCommissionAmount.toLocaleString()} {selectedOrder.currency}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>خصم عمولة الوكيل (10%):</span>
                <span>-{selectedOrder.agentCommissionAmount.toLocaleString()} {selectedOrder.currency}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
                <span>الصافي للتسليم الأخير:</span>
                <span>{selectedOrder.netAmount.toLocaleString()} {selectedOrder.currency}</span>
              </div>
            </div>

            {/* Reject reason input */}
            {showRejectInput && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-2 text-right">
                <label className="block text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  سبب الرفض (حقل إجباري)
                </label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="اكتب سبب الرفض هنا بوضوح لظهر للوكيل..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-red-500/40 text-slate-100 text-xs focus:outline-none focus:border-red-400"
                />
              </div>
            )}

            {/* Admin Action Bar for Order Statuses */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                إغلاق
              </button>

              {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Status 1: قيد التنفيذ */}
                  {selectedOrder.status !== 'processing' && selectedOrder.status !== 'pending' && (
                    <button
                      id="status-processing-btn"
                      onClick={() => {
                        onUpdateStatus(selectedOrder.id, 'processing');
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      تحديد كـ "قيد التنفيذ"
                    </button>
                  )}

                  {/* Status 2: مرفوض */}
                  {!showRejectInput ? (
                    <button
                      id="show-reject-btn"
                      onClick={() => {
                        setShowRejectInput(true);
                        setRejectionReason(selectedOrder.rejectionReason || '');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      تحديد كـ "مرفوض"
                    </button>
                  ) : (
                    <button
                      id="confirm-reject-btn"
                      onClick={() => {
                        if (!rejectionReason.trim()) {
                          alert('الرجاء كتابة سبب الرفض أولاً (حقل إجباري).');
                          return;
                        }
                        onUpdateStatus(selectedOrder.id, 'rejected', rejectionReason.trim());
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      تأكيد الرفض وكتابة السبب
                    </button>
                  )}

                  {/* Status 3: تم التسليم */}
                  {selectedOrder.status !== 'delivered' && (
                    <button
                      id="deliver-and-archive-btn"
                      onClick={() => {
                        onUpdateStatus(selectedOrder.id, 'delivered');
                        setSelectedOrder(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      تحديد كـ "تم التسليم"
                    </button>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
