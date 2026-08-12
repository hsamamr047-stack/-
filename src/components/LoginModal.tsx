import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, ShieldCheck, Key, AlertCircle, ArrowLeft, Building2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
  isRouteGuard?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isRouteGuard = false,
}) => {
  const [email, setEmail] = useState('hsamamr047@gmail.com');
  const [password, setPassword] = useState('778915hhhh');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.error || 'فشل تسجيل الدخول. تحقق من البريد أو كلمة المرور.');
      }
    } catch (err: any) {
      setError('تعذر الاتصال بخادم المصادقة المغلق.');
    } finally {
      setLoading(false);
    }
  };

  const fillSuperAdmin = () => {
    setEmail('hsamamr047@gmail.com');
    setPassword('778915hhhh');
    setError(null);
  };

  const fillAgentRiyadh = () => {
    setEmail('riyadh@qutaina.com');
    setPassword('AgentRiyadh2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0a0f1e]/90 border border-white/15 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Modal Gold Header */}
        <div className="bg-white/5 backdrop-blur-md p-6 border-b border-white/10 text-center relative">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 mb-3">
            <div className="w-full h-full bg-[#0a0f1e] rounded-[14px] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-amber-300">
            شركة قطينة والحسام العالمية لتحويلات المالية
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            البوابة الأمنية المغلقة - الدخول فقط بإنشاء يدوي من المدير العام
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            تشفير بنكي عالي الأمان (Private Vault)
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              البريد الإلكتروني المعتمد
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:border-amber-400 focus:outline-none transition"
                placeholder="hsamamr047@gmail.com"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              كلمة المرور المشفرة
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:border-amber-400 focus:outline-none transition"
                placeholder="••••••••••••"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Key className="w-4 h-4" />
                تأكيد الدخول الآمن
              </>
            )}
          </button>

          {/* Preset Fill Button for Super Admin */}
          <div className="pt-3 border-t border-white/10 space-y-2 text-right">
            <p className="text-[11px] text-slate-400 font-semibold mb-1">
              حساب مدير النظام الرئيسي المعتمد:
            </p>
            
            <button
              id="fill-super-admin-btn"
              type="button"
              onClick={fillSuperAdmin}
              className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center justify-between transition"
            >
              <span className="font-mono text-[11px]">hsamamr047@gmail.com</span>
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                المدير الحسام (Super Admin)
              </span>
            </button>
          </div>

          {!isRouteGuard && (
            <div className="text-center pt-2">
              <button
                id="login-close-btn"
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                إلغاء وإغلاق النافذة
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
