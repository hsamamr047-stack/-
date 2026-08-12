import React from 'react';
import { SystemStats, User } from '../types';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  FileText,
  PlusCircle,
  Landmark,
  Calculator,
  ArrowUpRight,
  User as UserIcon,
} from 'lucide-react';

interface LuxuryBannerProps {
  stats: SystemStats;
  currentUser: User | null;
  onSelectTab: (tab: string) => void;
  onOpenNewTransfer: () => void;
}

export const LuxuryBanner: React.FC<LuxuryBannerProps> = ({
  stats,
  currentUser,
  onSelectTab,
  onOpenNewTransfer,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Main Luxury Hero Canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 shadow-2xl">
        
        {/* Background Decorative Gold Light Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                النظام المالي المعتمد لشركة قطينة والحسام العالمية
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wide leading-tight">
              أهلاً بك في منصة التحويلات المالية الدولية المقفلة
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              متابعة مباشرة للحسابات الدولية، إدارة آلية لخصومات العمولات (10% وسيط + 10% وكيل)، مراسلات صوتية ومستندية حية، مع تحويل آلي للطلبات المسلمة إلى فواتير مؤرشفة للتدقيق المالي.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-new-transfer-btn"
                onClick={onOpenNewTransfer}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs hover:brightness-110 transition shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                إنشاء طلب تحويل جديد
              </button>

              <button
                id="hero-accounts-btn"
                onClick={() => onSelectTab('accounts')}
                className="py-3 px-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-amber-300 hover:bg-white/20 font-bold text-xs transition flex items-center gap-2"
              >
                <Landmark className="w-4 h-4" />
                استعراض الحسابات البنكية الدولية
              </button>
            </div>
          </div>

          {/* User Quick Info Box */}
          <div className="w-full lg:w-72 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-inner space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-400/80 flex items-center justify-center text-amber-300">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">{currentUser?.name}</p>
                <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                  {currentUser?.role === 'super_admin' ? 'Super Admin (المدير العام)' : currentUser?.agentCode}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>نوع الصلاحية:</span>
                <span className="text-emerald-400 font-bold">وصول آمن كامل</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>نسب العمولات الآلية:</span>
                <span className="text-amber-300 font-bold font-mono">10% وسيط | 10% وكيل</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Financial Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Volume */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>إجمالي حجم التحويلات</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-200">
            ${stats.totalGrossVolumeUSD.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>عدد العمليات الكلي:</span>
            <span className="text-slate-200 font-bold font-mono">{stats.totalTransfersCount} طلب</span>
          </div>
        </div>

        {/* Total Net Delivered */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>إجمالي الصافي المسلم</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-300">
            ${stats.totalNetVolumeUSD.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>المعاملات المؤرشفة:</span>
            <span className="text-emerald-400 font-bold font-mono">{stats.deliveredCount} تسليم</span>
          </div>
        </div>

        {/* Commissions Processed */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>إجمالي العمولات المخصومة (20%)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-300">
            ${stats.totalCommissionsUSD.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>تقسيم العمولات:</span>
            <span className="text-amber-400 font-bold">10% وسيط / 10% وكيل</span>
          </div>
        </div>

        {/* Pending & Active Bank Accounts */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>الطلبات المعلقة والبنوك</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-amber-300">
              {stats.pendingCount} <span className="text-xs text-slate-400">معلق</span>
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              {stats.activeAccountsCount} بنك دولي
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>فواتير الفحص والأرشفة:</span>
            <span className="text-slate-200 font-bold font-mono">{stats.archivedInvoicesCount} فاتورة</span>
          </div>
        </div>

      </div>

    </div>
  );
};
