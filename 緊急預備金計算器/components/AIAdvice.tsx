
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { ExpenseItem, SummaryData } from '../types';

interface AIAdviceProps {
  expenses: ExpenseItem[];
  summary: SummaryData;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ expenses, summary }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAIAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const includedItems = expenses.filter(e => e.included);
      
      const prompt = `
        我正在計算我的緊急預備金。
        我的月支出明細如下：
        ${includedItems.map(i => `- ${i.name}: $${i.amount}`).join('\n')}
        
        每月最低標準總計: $${summary.monthlyTotal}
        
        請根據我的支出結構，給我 3 個具體的理財建議：
        1. 支出優化建议（哪裡可能花太多？）
        2. 風險提醒（考慮到我的債務與固定支出）
        3. 存錢策略
        請用親切、專業的口氣，繁體中文回答。限制在 200 字以內。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || '無法生成建議，請稍後再試。');
    } catch (error) {
      console.error('Error fetching AI advice:', error);
      setAdvice('系統忙碌中，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
          AI 財務教練
        </h3>
        <button 
          onClick={getAIAdvice}
          disabled={loading}
          className="text-xs font-bold text-pink-600 hover:text-pink-700 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <MessageSquare className="w-4 h-4 mr-1" />
          )}
          {advice ? '重新分析' : '獲取建議'}
        </button>
      </div>

      {advice ? (
        <div className="prose prose-pink max-w-none">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-pink-50/50 p-4 rounded-xl border border-pink-100">
            {advice}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 text-sm">
            點擊「獲取建議」，AI 將根據您的支出情況提供專屬財務建議。
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvice;
