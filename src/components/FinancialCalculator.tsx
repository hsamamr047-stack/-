import React, { useState } from 'react';
import { Calculator, Percent, ShieldCheck, ArrowRight, DollarSign, TrendingDown, RefreshCw, CheckCircle2 } from 'lucide-react';

interface FinancialCalculatorProps {
  onStartTransferWithAmount: (amount: number, currency: string) => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  onStartTransferWithAmount,
}) => {
  const [grossAmount, setGrossAmount] = useState<number>(10000);
  const [currency, setCurrency] = useState<string>('USD');
  const [brokerPct, setBrokerPct] = useState<number>(10);
  const [agentPct, setAgentPct] = useState<number>(10);

  // Calculations
  const brokerAmount = Math.round((grossAmount * (brokerPct / 100)) * 100) / 100;
  const agentAmount = Math.round((grossAmount * (agentPct / 100)) * 100) / 100;
  const totalDeductions = brokerAmount + agentAmount;
  const netAmount = Math.max(0, Math.round((grossAmount - totalDeductions) * 100) / 100);

  const brokerBarWidth = Math.min(100, (brokerAmount / grossAmount) * 100 || 0);
  const agentBarWidth = Math.min(100, (agentAmount / grossAmount) * 100 || 0);
  const netBarWidth = Math.min(100, (netAmount / grossAmount) * 100 || 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Financial Engine Core
          </span>
          <h2 className="text-2xl font-bold text-amber-200 mt-1">
            المحرك المالي الحسابي الآلي للعمولات
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
            محرك مالي دقيق لحساب الخصومات التلقائية: (10% للوسيط المالي + 10% لوكيل التحويلات) وعرض الصافي والمتبقي بصورة شفافة وفورية للإدارة والوكلاء.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-right">
          <p className="text-[10px] text-slate-400 font-mono">معادلة الخصم المعتمدة:</p>
          <p className="text-xs font-bold text-amber-300 font-mono mt-0.5">
            الصافي = المبلغ الإجمالي - (10% وسيط + 10% وكيل)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              مدخلات العملية المالية
            </h3>
            <button
              onClick={() => {
                setGrossAmount(10000);
                setBrokerPct(10);
                setAgentPct(10);
              }}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> إعادة تعيين
            </button>
          </div>

          {/* Gross Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              المبلغ الإجمالي المحول (Gross Amount)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                value={grossAmount}
                onChange={(e) => setGrossAmount(Number(e.target.value) || 0)}
                className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-amber-300 font-mono font-bold text-lg focus:border-amber-400 focus:outline-none transition shadow-inner"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="absolute left-2 top-2 bottom-2 px-3 rounded-xl bg-white/10 text-slate-100 font-bold text-xs border border-white/10"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="SAR">SAR (ر.س)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 50000].map((preset) => (
              <button
                key={preset}
                onClick={() => setGrossAmount(preset)}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  grossAmount === preset
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-black/40 text-slate-300 border-white/10 hover:border-amber-500/30'
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Commission Controls */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-300">عمولة الوسيط المالي (Broker Fee)</span>
                <span className="font-mono text-amber-400">{brokerPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={brokerPct}
                onChange={(e) => setBrokerPct(Number(e.target.value))}
                className="w-full accent-amber-500 bg-white/10 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-400">عمولة وكيل التحويلات (Agent Fee)</span>
                <span className="font-mono text-emerald-400">{agentPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={agentPct}
                onChange={(e) => setAgentPct(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-white/10 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => onStartTransferWithAmount(grossAmount, currency)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            اعتماد هذه الحسبة وإنشاء طلب تحويل
          </button>
        </div>

        {/* Breakdown Output & Visual Bar Column */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
              <span>نتائج تفكيك العملية والخصومات المعتمدة</span>
              <span className="text-xs text-amber-400 font-mono">حساب فورى</span>
            </h3>

            {/* Visual Progress Ratio Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>المخطط البياني لتوزيع المبلغ</span>
                <span>إجمالي: {grossAmount.toLocaleString()} {currency}</span>
              </div>
              
              <div className="h-6 w-full bg-black/40 rounded-xl overflow-hidden flex border border-white/10 p-0.5">
                <div
                  style={{ width: `${netBarWidth}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-l-lg transition-all duration-300 flex items-center justify-center text-[10px] text-slate-950 font-bold overflow-hidden px-1"
                  title="الصافي"
                >
                  الصافي {netBarWidth.toFixed(0)}%
                </div>
                <div
                  style={{ width: `${brokerBarWidth}%` }}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300 flex items-center justify-center text-[10px] text-slate-950 font-bold overflow-hidden px-1"
                  title="الوسيط"
                >
                  الوسيط
                </div>
                <div
                  style={{ width: `${agentBarWidth}%` }}
                  className="bg-gradient-to-r from-amber-300 to-amber-200 h-full rounded-r-lg transition-all duration-300 flex items-center justify-center text-[10px] text-slate-950 font-bold overflow-hidden px-1"
                  title="الوكيل"
                >
                  الوكيل
                </div>
              </div>
            </div>

            {/* Financial Result Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gross Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-xs text-slate-400 font-semibold mb-1">المبلغ الإجمالي الميداني</p>
                <p className="text-xl font-bold font-mono text-slate-100">
                  {grossAmount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{currency}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">100% رأس المال المحول</p>
              </div>

              {/* Total Deductions Card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-300 font-semibold mb-1">إجمالي العمولات المخصومة ({brokerPct + agentPct}%)</p>
                <p className="text-xl font-bold font-mono text-amber-300">
                  -{totalDeductions.toLocaleString()} <span className="text-xs text-amber-400 font-normal">{currency}</span>
                </p>
                <p className="text-[10px] text-amber-400/80 mt-1">
                  خصم تلقائي {brokerPct}% وسيط + {agentPct}% وكيل
                </p>
              </div>

            </div>

            {/* Detailed Row Cards */}
            <div className="mt-4 space-y-2.5 text-xs font-mono">
              
              <div className="p-3 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-slate-300 font-sans flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  عمولة الوسيط المالي ({brokerPct}%):
                </span>
                <span className="font-bold text-amber-400">
                  {brokerAmount.toLocaleString()} {currency}
                </span>
              </div>

              <div className="p-3 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-slate-300 font-sans flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300"></span>
                  عمولة وكيل التحويلات ({agentPct}%):
                </span>
                <span className="font-bold text-amber-300">
                  {agentAmount.toLocaleString()} {currency}
                </span>
              </div>

            </div>

          </div>

          {/* Final Net Result Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-black/40 to-black/60 border border-emerald-500/40 shadow-xl flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                المبلغ الصافي المستلم المتبقي (Net Payout)
              </span>
              <p className="text-3xl font-bold font-mono text-emerald-300 mt-1">
                {netAmount.toLocaleString()}{' '}
                <span className="text-sm text-emerald-400 font-sans">{currency}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                جاهز للتسليم
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
