
import React from 'react';
import { Table, Trash2, Calendar, Download, Wallet, TrendingUp } from 'lucide-react';
import { SavedRecord } from '../types';

interface PersonalFundSheetProps {
  records: SavedRecord[];
  onDelete: (id: string) => void;
}

const PersonalFundSheet: React.FC<PersonalFundSheetProps> = ({ records, onDelete }) => {
  
  const exportToCSV = () => {
    if (records.length === 0) {
      alert('目前沒有紀錄可以匯出！');
      return;
    }

    // 定義 CSV 標頭：日期, 總支出, 總存錢, 備註
    const headers = ['日期', '總支出', '總存錢', '備註'];
    
    // 轉換資料列
    const csvRows = records.map(record => [
      `"${record.date}"`,
      record.monthlyTotal,
      record.savingsTotal,
      `"${record.details.replace(/"/g, '""')}"`
    ]);

    // 合併標頭與內容
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // 加入 BOM 確保 Excel 開啟時能正確辨識繁體中文
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `個人資金管理_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-slate-800 p-6 flex items-center justify-between">
        <div className="flex items-center">
          <Table className="w-6 h-6 mr-2 text-blue-400" />
          <h2 className="text-xl font-bold text-white">
            個人資金管理 Sheet
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-600"
          >
            <Download className="w-4 h-4" />
            <span>匯出 CSV</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">日期</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 mr-1 text-red-400" />
                  總支出 (Expense)
                </div>
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                  總存錢 (Savings)
                </div>
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">備註 (包含項目)</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 opacity-40" />
                      {record.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    ${record.monthlyTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${record.savingsTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                    {record.details}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  目前尚無存檔紀錄，點擊右上方「確認並存檔」來新增您的第一筆試算。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalFundSheet;
