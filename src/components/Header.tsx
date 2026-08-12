import React, { useState } from 'react';
import { User } from '../types';
import { Building2, ShieldCheck, LogOut, Bell, ChevronDown, UserCheck, Sparkles, KeyRound, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  pendingOrdersCount: number;
  unreadMessagesCount: number;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenLogin,
  pendingOrdersCount,
  unreadMessagesCount,
  onSelectTab,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 text-slate-100 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/80 bg-slate-900/90 flex items-center justify-center shadow-inner">
              <img
                src="/src/assets/images/qutaina_husam_logo_1786391238778.jpg"
                alt="شركة قطينة والحسام العالمية"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Building2 className="w-6 h-6 text-amber-400 absolute" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent tracking-wide">
                شركة قطينة والحسام العالمية
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                لتحويلات المالية
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              النظام المالي والإداري المعتمد للتحويلات الدولية
            </p>
          </div>
        </div>

        {/* Right Side Controls & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Notifications Button */}
          {currentUser && (
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all duration-200"
                title="الإشعارات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                {(pendingOrdersCount > 0 || unreadMessagesCount > 0) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-slate-950">
                    {pendingOrdersCount + unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifDropdown && (
                <div className="absolute left-0 sm:right-auto mt-2 w-80 glass-dropdown rounded-2xl shadow-2xl p-4 text-sm z-50 animate-in fade-in zoom-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> الإشعارات الحية
                    </h3>
                    <span className="text-xs text-slate-400">تحديث مباشر</span>
                  </div>

                  <div className="space-y-3 mt-3 max-h-60 overflow-y-auto">
                    {pendingOrdersCount > 0 ? (
                      <div
                        onClick={() => {
                          onSelectTab('orders');
                          setShowNotifDropdown(false);
                        }}
                        className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/20 transition"
                      >
                        <p className="font-semibold text-amber-300">طلبات تحويل معلقة ({pendingOrdersCount})</p>
                        <p className="text-xs text-slate-300 mt-1">
                          تتطلب مراجعة واعتماد الإدارة للتحويل والتسليم.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">لا توجد طلبات معلقة</p>
                    )}

                    {unreadMessagesCount > 0 && (
                      <div
                        onClick={() => {
                          onSelectTab('messages');
                          setShowNotifDropdown(false);
                        }}
                        className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition"
                      >
                        <p className="font-semibold text-emerald-400">رسائل جديدة ({unreadMessagesCount})</p>
                        <p className="text-xs text-slate-300 mt-1">تنبيهات من المحادثات والملاحظات الصوتية.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Badge or Login button */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.role === 'super_admin' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline-block" />
                    )}
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono">
                    {currentUser.role === 'super_admin'
                      ? 'مدير النظام الأعلى (Super Admin)'
                      : currentUser.role === 'agent'
                      ? `وكيل - ${currentUser.agentCode}`
                      : `وسيط مالي - ${currentUser.agentCode}`}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showUserDropdown && (
                <div className="absolute left-0 mt-2 w-64 glass-dropdown rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-150">
                  <div className="p-3 bg-white/5 rounded-xl mb-2 text-right border border-white/5">
                    <p className="text-xs font-bold text-amber-300">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                    <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 inline-block">
                      عمولة الوكيل: {currentUser.agentCommissionPct}% | الوسيط: {currentUser.brokerCommissionPct}%
                    </div>
                  </div>

                  {currentUser.role === 'super_admin' && (
                    <button
                      id="header-user-mgmt-btn"
                      onClick={() => {
                        onSelectTab('users');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-right px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 rounded-lg flex items-center gap-2 transition"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      إدارة المستخدمين والوكلاء
                    </button>
                  )}

                  <button
                    id="header-logout-btn"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-right px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج من النظام
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              دخول النظام (Super Admin)
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
