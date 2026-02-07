
import React from 'react';
import { Calculator, ShieldCheck, CheckCircle } from 'lucide-react';
import { SummaryData } from '../types';

interface SummarySectionProps {
  summary: SummaryData;
  multiplier: number;
  onMultiplierChange: (val: number) => void;
  onConfirm: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary, multiplier, onMultiplierChange, onConfirm }) => {
  const finalFund = summary.monthlyTotal * multiplier;

  return (
    <div className="bg-pink-600 rounded-3xl shadow-2xl p-8 text-white sticky top-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center">
          <Calculator className="w-6 h-6 mr-2" />
          一個月最低生活標準
        </h2>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex justify-between items-center border-b border-pink-500 pb-2">
          <span className="text-pink-100">固定支出合計</span>
          <span className="font-bold text-lg">${summary.fixedTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-b border-pink-500 pb-2">
          <span className="text-pink-100">生活預算合計</span>
          <span className="font-bold text-lg">${summary.livingTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-b border-pink-500 pb-2">
          <span className="text-pink-100">債務支出合計</span>
          <span className="font-bold text-lg">${summary.debtTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-white font-bold text-xl uppercase tracking-wider">月最低總計</span>
          <span className="font-extrabold text-3xl">${summary.monthlyTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
        <div className="space-y-2">
          <p className="text-sm text-pink-200">最低標準生活費 ${summary.monthlyTotal.toLocaleString()} (計算基準為 {multiplier} 個月預備金)</p>
          <div className="text-center mt-6">
            <h3 className="text-pink-100 text-sm font-medium mb-1 uppercase tracking-widest">您的緊急預備金目標</h3>
            <div className="text-5xl font-black text-white drop-shadow-lg">
              ${finalFund.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full bg-white text-pink-700 font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-50 transition-all flex items-center justify-center space-x-2 active:scale-95 mb-4"
      >
        <CheckCircle className="w-5 h-5" />
        <span>確認並存檔至個人資金管理</span>
      </button>

      <div className="flex items-center justify-center text-pink-100 text-xs italic">
        <ShieldCheck className="w-4 h-4 mr-1" />
        這筆錢能讓您在零收入情況下維持生活
      </div>
    </div>
  );
};

export default SummarySection;
