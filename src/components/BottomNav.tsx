import React from 'react';
import {
  User as UserIcon,
  Landmark,
  PlusCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewTransfer: () => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewTransfer,
  unreadMessagesCount = 0,
}) => {
  const tabs = [
    {
      id: 'profile',
      label: 'حسابي',
      icon: UserIcon,
      isAction: false,
    },
    {
      id: 'accounts',
      label: 'الحسابات المتوفرة',
      icon: Landmark,
      isAction: false,
    },
    {
      id: 'new_transfer',
      label: 'رفع طلب تحويل',
      icon: PlusCircle,
      isAction: true,
    },
    {
      id: 'messages',
      label: 'المراسلة',
      icon: MessageSquare,
      isAction: false,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: 'invoices',
      label: 'الفواتير',
      icon: FileText,
      isAction: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-amber-500/20 shadow-2xl px-2 py-1.5 md:py-2">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                id="bottom-nav-new-transfer-btn"
                onClick={onOpenNewTransfer}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition border-2 border-slate-950">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-1 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`bottom-nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition duration-200 relative ${
                isActive
                  ? 'text-amber-300 bg-white/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
