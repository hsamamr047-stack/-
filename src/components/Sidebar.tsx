import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Landmark,
  Calculator,
  ArrowLeftRight,
  FileText,
  MessageSquare,
  Users,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole?: UserRole;
  pendingCount: number;
  onOpenNewTransfer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  pendingCount,
  onOpenNewTransfer,
}) => {
  const navItems = [
    {
      id: 'profile',
      label: 'حسابي (بيانات المستخدم)',
      icon: Users,
      badge: 'شخصي',
    },
    {
      id: 'accounts',
      label: 'الحسابات المتوفرة',
      icon: Landmark,
      badge: 'بنكية',
    },
    {
      id: 'orders',
      label: 'طلبات التحويل الحية',
      icon: ArrowLeftRight,
      badge: pendingCount > 0 ? `${pendingCount} معلق` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'messages',
      label: 'المراسلة والتواصل',
      icon: MessageSquare,
      badge: 'مباشر',
    },
    {
      id: 'invoices',
      label: 'الفواتير والتدقيق المالي',
      icon: FileText,
      badge: 'فلترة دقيقة',
    },
    {
      id: 'dashboard',
      label: 'اللوحة الإحصائية العامة',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calculator',
      label: 'المحرك المالي والعمولات',
      icon: Calculator,
      badge: '10% خصم',
    },
  ];

  if (userRole === 'super_admin' || userRole === 'admin') {
    navItems.push({
      id: 'users',
      label: 'إدارة الوكلاء والمستخدمين',
      icon: Users,
      badge: 'المدير',
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-500/30',
    });
  }

  return (
    <aside className="hidden md:flex w-72 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 flex-col gap-4 text-slate-200 shadow-xl shrink-0">
      
      {/* Quick Action Transfer Button */}
      <button
        id="sidebar-new-transfer-btn"
        onClick={onOpenNewTransfer}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm hover:brightness-110 transition duration-200 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group"
      >
        <PlusCircle className="w-5 h-5 text-slate-950 group-hover:rotate-90 transition duration-300" />
        إنشاء طلب تحويل جديد
      </button>

      {/* Navigation Items */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-right px-4 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-between transition duration-200 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-md backdrop-blur-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Luxury System Seal Footer */}
      <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          النظام المالي المشفر 256-bit
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          شركة قطينة والحسام العالمية لتحويلات المالية © 2026. كافة الحقوق محفوظة.
        </p>
      </div>

    </aside>
  );
};
