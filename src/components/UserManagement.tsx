import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Lock,
  Mail,
  Phone,
  Percent,
  CheckCircle2,
  XCircle,
  KeyRound,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: Partial<User>) => void;
  onEditUser?: (id: string, updatedUser: Partial<User>) => void;
  onDeleteUser?: (id: string) => void;
  onToggleUserActive: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleUserActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for Create/Edit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [phone, setPhone] = useState('');
  const [brokerCommissionPct, setBrokerCommissionPct] = useState<number>(10);
  const [agentCommissionPct, setAgentCommissionPct] = useState<number>(10);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.agentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('agent');
    setPhone('');
    setBrokerCommissionPct(10);
    setAgentCommissionPct(10);
    setShowAddModal(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword(u.password || '');
    setRole(u.role);
    setPhone(u.phone || '');
    setBrokerCommissionPct(u.brokerCommissionPct);
    setAgentCommissionPct(u.agentCommissionPct);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      name,
      email,
      password,
      role,
      phone,
      brokerCommissionPct,
      agentCommissionPct,
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser && onEditUser) {
      onEditUser(editingUser.id, {
        name,
        email,
        password,
        role,
        phone,
        brokerCommissionPct,
        agentCommissionPct,
      });
      setEditingUser(null);
    }
  };

  const handleDelete = (u: User) => {
    if (u.email === 'hsamamr047@gmail.com') {
      alert('لا يمكن حذف حساب المدير الرئيسي النظامي.');
      return;
    }
    if (window.confirm(`هل أنت تأكد من حذف حساب (${u.name} - ${u.email}) تماماً من النظام المغلق؟`)) {
      if (onDeleteUser) onDeleteUser(u.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Super Admin Access Control
          </span>
          <h2 className="text-2xl font-bold text-amber-200 mt-1">
            إدارة الحسابات والوكلاء والتصريح اليدوي
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            النظام مغلق بالكامل وبدون تسجيل عام. للمدير العام الحسام حاملاً الصلاحيات المطلقة لإضافة، تعديل، أو حذف حسابات الوكلاء والوسطاء وتعيين كلمات المرور والنسب يدوياً.
          </p>
        </div>

        <button
          id="add-user-btn"
          onClick={openAddModal}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          إنشاء حساب جديد بكلمة مرور
        </button>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم، البريد، كود الوكيل..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-amber-400 focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-black/40 text-amber-300 border-b border-white/10 font-bold">
              <tr>
                <th className="p-4">اسم المستخدم</th>
                <th className="p-4">كود الحساب</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الدور الصلاحي</th>
                <th className="p-4">نسبة عمولة الوكيل</th>
                <th className="p-4">نسبة الوسيط</th>
                <th className="p-4">حالة الحساب</th>
                <th className="p-4 text-center">إجراءات المدير العام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-sans font-bold text-slate-100 flex items-center gap-2">
                    {user.name}
                    {user.role === 'super_admin' && (
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    )}
                  </td>
                  <td className="p-4 text-amber-300 font-bold">{user.agentCode}</td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4 font-sans">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-amber-300 border border-white/10">
                      {user.role === 'super_admin'
                        ? 'مدير النظام (Super Admin)'
                        : user.role === 'agent'
                        ? 'وكيل تحويلات'
                        : 'وسيط مالي'}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">{user.agentCommissionPct}%</td>
                  <td className="p-4 text-amber-400 font-bold">{user.brokerCommissionPct}%</td>
                  <td className="p-4 font-sans">
                    {user.active ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> نشط
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> معطل
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg bg-white/10 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition font-sans text-[11px] flex items-center gap-1 px-2.5"
                        title="تعديل الحساب وكلمة المرور"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        تعديل
                      </button>

                      {user.email !== 'hsamamr047@gmail.com' && (
                        <>
                          <button
                            onClick={() => onToggleUserActive(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-sans ${
                              user.active
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.active ? 'تعطيل' : 'تفعيل'}
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                            title="حذف الحساب نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-[#0a0f1e]/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                إنشاء حساب جديد وتحديد الصلاحيات
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الكامل / اسم المكتب</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: مكتب إسطنبول للصرافة"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني للوصول</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@qutaina.com"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور المشفرة</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">دور الحساب</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                >
                  <option value="agent">وكيل تحويلات (Agent)</option>
                  <option value="broker">وسيط مالي (Broker)</option>
                  <option value="admin">مدير معتمد (Admin)</option>
                  <option value="auditor">مدقق مالي (Auditor)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">عمولة الوكيل (%)</label>
                  <input
                    type="number"
                    value={agentCommissionPct}
                    onChange={(e) => setAgentCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-emerald-400 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">عمولة الوسيط (%)</label>
                  <input
                    type="number"
                    value={brokerCommissionPct}
                    onChange={(e) => setBrokerCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-400 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold hover:bg-white/20 border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  تأكيد وإنشاء الحساب
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-[#0a0f1e]/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                تعديل بيانات الحساب الصلاحي
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الكامل / اسم المكتب</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني للوصول</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اتركها كما هي للحفاظ عليها"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">دور الحساب</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                >
                  <option value="super_admin">مدير النظام (Super Admin)</option>
                  <option value="admin">مدير معتمد (Admin)</option>
                  <option value="agent">وكيل تحويلات (Agent)</option>
                  <option value="broker">وسيط مالي (Broker)</option>
                  <option value="auditor">مدقق مالي (Auditor)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">عمولة الوكيل (%)</label>
                  <input
                    type="number"
                    value={agentCommissionPct}
                    onChange={(e) => setAgentCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-emerald-400 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">عمولة الوسيط (%)</label>
                  <input
                    type="number"
                    value={brokerCommissionPct}
                    onChange={(e) => setBrokerCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-400 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold hover:bg-white/20 border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
