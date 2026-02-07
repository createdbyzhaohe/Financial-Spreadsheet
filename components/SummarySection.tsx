
import React from 'react';
import { Calculator, Wallet, TrendingUp, CheckCircle } from 'lucide-react';
import { SummaryData } from '../types';

interface SummarySectionProps {
  summary: SummaryData;
  onConfirm: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary, onConfirm }) => {
  return (
    <div className="bg-pink-600 rounded-3xl shadow-2xl p-8 text-white sticky top-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center">
          <Calculator className="w-6 h-6 mr-2" />
          收支分配總結
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
        <div className="flex justify-between items-center pt-4">
          <span className="text-white font-bold text-xl uppercase tracking-wider">本月預計支出</span>
          <span className="font-extrabold text-3xl">${summary.monthlyTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-300" />
            <span className="text-pink-100 font-medium">本月預計存錢</span>
          </div>
          <span className="text-2xl font-black text-white">${summary.savingsTotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full bg-white text-pink-700 font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-50 transition-all flex items-center justify-center space-x-2 active:scale-95 mb-4"
      >
        <CheckCircle className="w-5 h-5" />
        <span>確認並存檔紀錄</span>
      </button>

      <div className="flex items-center justify-center text-pink-100 text-xs italic">
        <Wallet className="w-4 h-4 mr-1" />
        點擊確認後，資料將保存在下方表格與瀏覽器中
      </div>
    </div>
  );
};

export default SummarySection;
