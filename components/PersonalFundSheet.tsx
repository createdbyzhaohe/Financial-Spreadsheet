
import React from 'react';
import { Table, Trash2, Calendar, Download } from 'lucide-react';
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

    // 定義 CSV 標頭
    const headers = ['日期', '月標準支出', '準備月數', '預備金目標', '備註'];
    
    // 轉換資料列
    const csvRows = records.map(record => [
      `"${record.date}"`,
      record.monthlyTotal,
      record.multiplier,
      record.targetFund,
      `"${record.details.replace(/"/g, '""')}"` // 處理雙引號避免 CSV 格式錯誤
    ]);

    // 合併標頭與內容
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // 加入 BOM (Byte Order Mark) 確保 Excel 開啟時能正確辨識繁體中文 (UTF-8)
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 建立虛擬連結並點擊下載
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
            title="匯出為 CSV 檔案以供 Excel 使用"
          >
            <Download className="w-4 h-4" />
            <span>匯出 CSV</span>
          </button>
          <span className="text-slate-400 text-sm hidden sm:inline">歷史試算紀錄清單</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">日期</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">月標準支出</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">準備月數</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">預備金目標</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">備註</th>
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
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    ${record.monthlyTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {record.multiplier} 個月
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-pink-600">
                    ${record.targetFund.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                    {record.details}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="刪除此紀錄"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                  目前尚無存檔紀錄，點擊上方「確認並存檔」來新增您的第一筆試算。
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
