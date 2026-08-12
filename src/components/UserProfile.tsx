import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, ShieldCheck, Key, Phone, Mail, Award, Lock, CheckCircle2, UserCheck } from 'lucide-react';

interface UserProfileProps {
  currentUser: User | null;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onSelectTab,
  onLogout,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-300">لم يتم تسجيل الدخول بعد</h3>
        <p className="text-xs text-slate-400">الرجاء تسجيل الدخول للوصول إلى بيانات حسابك الشخصي.</p>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === 'super_admin' || currentUser.email === 'hsamamr047@gmail.com';

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword.length < 6) {
      setPassMessage('كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل.');
      return;
    }

    if (isSuperAdmin) {
      if (newPassword !== confirmPassword) {
        setPassMessage('كلمة المرور التأكيدية غير متطابقة.');
        return;
      }
      setPassMessage('✅ تم تحديث كلمة المرور الخاصة بالمدير العام بنجاح.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      // Send a formal password reset request to the Manager via Messaging API
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            content: `🔑 طلب تغيير كلمة مرور للمستخدم (${currentUser.name} - ${currentUser.email}): يرغب في تغيير كلمة المرور إلى (${newPassword}). يرجى الاعتماد والتحديث من لوحة إدارة المستخدمين.`,
            type: 'text',
          }),
        });
        setPassMessage('✅ تم إرسال طلب تغيير كلمة المرور بنجاح إلى المدير العام (المدير الحسام). سيتم المراجعة وتحديث حسابك.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setPassMessage('حدث خطأ أثناء رفع الطلب للمدير، يرجى المحاولة لاحقاً.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-right w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <UserIcon className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-amber-200">{currentUser.name}</h2>
              {currentUser.role === 'super_admin' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Super Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">{currentUser.email}</p>
            <p className="text-[11px] text-amber-400/90 font-mono mt-0.5">رمز الحساب: {currentUser.agentCode}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
            <button
              onClick={() => onSelectTab('users')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              إدارة المستخدمين والوكلاء
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-xs font-bold transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Account Details & Commission Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 pb-3 border-b border-white/10">
            <UserIcon className="w-4 h-4 text-amber-400" />
            بيانات الحساب الشخصي
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-slate-400">الاسم الكامل:</span>
              <span className="font-bold text-slate-100">{currentUser.name}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-slate-400">البريد الإلكتروني:</span>
              <span className="font-bold font-mono text-slate-200">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-slate-400">رقم الهاتف:</span>
              <span className="font-bold font-mono text-slate-200" dir="ltr">{currentUser.phone || 'غير مسجل'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-slate-400">دور المستخدم:</span>
              <span className="font-bold text-amber-300">
                {currentUser.role === 'super_admin'
                  ? 'المدير العام (Super Admin)'
                  : currentUser.role === 'agent'
                  ? 'وكيل تحويلات معتمد'
                  : 'وسيط مالي معتمد'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Commission Rates */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 pb-3 border-b border-white/10">
            <Award className="w-4 h-4 text-emerald-400" />
            نسب العمولات المالية المعتمدة
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-300">عمولة وكيل التحويل</p>
                <p className="text-[10px] text-slate-400 mt-0.5">تُخصم آلياً عند تنفيذ وإصدار طلب التحويل</p>
              </div>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {currentUser.agentCommissionPct}%
              </span>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-300">عمولة الوسيط المالي</p>
                <p className="text-[10px] text-slate-400 mt-0.5">تُخصم آلياً لمصلحة الوسيط المعتمد</p>
              </div>
              <span className="text-2xl font-bold font-mono text-amber-400">
                {currentUser.brokerCommissionPct}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Change Password Section */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-w-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            {isSuperAdmin ? 'تغيير كلمة المرور وتأمين الحساب' : 'طلب تغيير كلمة المرور (يتطلب موافقة المدير العام)'}
          </h3>
          {!isSuperAdmin && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              يتطلب اعتماد المدير
            </span>
          )}
        </div>

        {passMessage && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold leading-relaxed">
            {passMessage}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isSuperAdmin ? 'كلمة المرور الجديدة' : 'كلمة المرور الجديدة المطلوبة'}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isSuperAdmin ? 'تأكيد كلمة المرور' : 'إعادة تأكيد كلمة المرور'}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>

          {!isSuperAdmin && (
            <p className="text-[11px] text-slate-400 bg-black/30 p-2.5 rounded-xl border border-white/5">
              💡 <strong className="text-amber-300">ملاحظة أمنية:</strong> لا يُسمح للوكلاء أو الوسطاء بتغيير كلمة المرور مباشرة. عند الضغط على إرسال، سيتم رفعه كطلب رسمي إلى المدير العام (<span className="text-amber-200">المدير الحسام - hsamamr047@gmail.com</span>) للمراجعة والاعتماد.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSuperAdmin ? 'تحديث كلمة المرور مباشرة' : 'إرسال طلب تغيير كلمة المرور للمدير'}
          </button>
        </form>
      </div>

    </div>
  );
};
