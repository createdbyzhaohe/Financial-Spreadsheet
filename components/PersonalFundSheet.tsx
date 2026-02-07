import React, { useState } from 'react';
import { Trash2, Copy, FileSpreadsheet, Calendar, ChevronRight, Check, Download } from 'lucide-react';
import { SavedRecord, Category } from '../types.ts';
import * as XLSX from 'xlsx';

interface PersonalFundSheetProps {
  records: SavedRecord[];
  onDelete: (id: string) => void;
}

const PersonalFundSheet: React.FC<PersonalFundSheetProps> = ({ records, onDelete }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. 下載標準 .xlsx 檔案
  const downloadXLSX = (record: SavedRecord) => {
    const rows: any[][] = [];
    
    // 標題列
    rows.push(['類別', '項目名稱', '金額']);

    Object.values(Category).forEach((cat) => {
      const catItems = record.items.filter(item => item.category === cat);
      if (catItems.length > 0) {
        // 分類標題 (空一行或特殊標記)
        rows.push([`>> ${cat}`, '', '']);
        
        catItems.forEach(item => {
          rows.push([item.category, item.name, item.amount]);
        });
        
        // 分類小計
        const catSum = catItems.reduce((sum, i) => sum + i.amount, 0);
        rows.push(['', `${cat} 小計`, catSum]);
        rows.push(['', '', '']); // 空行
      }
    });

    // 總結
    rows.push(['---', '---', '---']);
    rows.push(['總結', '本月總計支出', record.summary.monthlyTotal]);
    rows.push(['總結', '本月總計存錢', record.summary.savingsTotal]);

    // 使用 XLSX 函式庫建立工作表
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "預算報表");

    // 產生並下載檔案
    const fileName = `財務預算表_${record.date.replace(/[:\/ ]/g, '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // 2. 複製至剪貼簿功能 (Google Sheets 相容 TSV)
  const copyForGoogleSheets = (record: SavedRecord) => {
    let rows: string[] = [];
    rows.push(['類別', '項目名稱', '金額'].join('\t'));

    Object.values(Category).forEach((cat) => {
      const catItems = record.items.filter(item => item.category === cat);
      if (catItems.length > 0) {
        rows.push([`[ ${cat} ]`, '', ''].join('\t'));
        catItems.forEach(item => {
          rows.push([cat, item.name, item.amount].join('\t'));
        });
        const catSum = catItems.reduce((sum, i) => sum + i.amount, 0);
        rows.push(['', `${cat} 小計`, catSum].join('\t'));
        rows.push(['', '', ''].join('\t'));
      }
    });

    rows.push(['總結', '本月總計支出', record.summary.monthlyTotal].join('\t'));
    rows.push(['總結', '本月總計存錢', record.summary.savingsTotal].join('\t'));

    const finalString = rows.join('\n');
    navigator.clipboard.writeText(finalString).then(() => {
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-600 mb-2">尚無財務紀錄</h2>
        <p className="text-slate-400">在上方填寫預算並點擊「確認並存檔」，結果將會呈現在此。</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center">
          <FileSpreadsheet className="w-7 h-7 mr-2 text-green-600" />
          財務歷史紀錄 (Google Sheets 相容)
        </h2>
        <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          共有 {records.length} 筆紀錄
        </span>
      </div>

      {records.map((record) => (
        <div key={record.id} className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden group transition-all hover:border-green-400">
          {/* Header */}
          <div className="bg-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between text-white border-b-4 border-green-600 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{record.date} 預算清單</h3>
                <p className="text-xs text-slate-400 font-mono">{record.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadXLSX(record)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
                title="下載 .xlsx 檔案"
              >
                <Download className="w-4 h-4" />
                <span>下載 .xlsx</span>
              </button>

              <button
                onClick={() => copyForGoogleSheets(record)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg min-w-[140px] justify-center ${
                  copiedId === record.id 
                    ? 'bg-white text-green-700 scale-95' 
                    : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                }`}
              >
                {copiedId === record.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>複製貼上</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onDelete(record.id)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="刪除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Spreadsheet Table UI */}
          <div className="overflow-x-auto p-0">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] text-center font-mono">
                  <th className="w-10 border border-slate-200 py-1"></th>
                  <th className="border border-slate-200">A</th>
                  <th className="border border-slate-200">B</th>
                  <th className="border border-slate-200">C</th>
                </tr>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase border-b-2 border-slate-300">
                  <td className="w-10 border border-slate-200 bg-slate-100"></td>
                  <th className="px-6 py-2 text-left border border-slate-200">類別</th>
                  <th className="px-6 py-2 text-left border border-slate-200">項目名稱</th>
                  <th className="px-6 py-2 text-right border border-slate-200">金額</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans">
                {Object.values(Category).map((cat) => {
                  const catItems = record.items.filter(item => item.category === cat);
                  if (catItems.length === 0) return null;

                  return (
                    <React.Fragment key={cat}>
                      <tr className="bg-green-50/30">
                        <td className="border border-slate-200 bg-slate-50 text-center text-[10px] text-slate-300 font-mono">#</td>
                        <td colSpan={3} className="px-6 py-1.5 font-black text-green-700 border border-slate-200">
                          <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            {cat}
                          </div>
                        </td>
                      </tr>
                      {catItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 group">
                          <td className="border border-slate-200 text-center text-[10px] text-slate-300 bg-slate-50 font-mono">{idx + 1}</td>
                          <td className="px-6 py-2 border border-slate-200 text-slate-400 italic">{cat}</td>
                          <td className="px-6 py-2 border border-slate-200 font-medium text-slate-700">{item.name}</td>
                          <td className="px-6 py-2 border border-slate-200 text-right font-mono text-slate-600 bg-slate-50/30">
                            ${item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/80 italic text-slate-500">
                        <td className="border border-slate-200 bg-slate-100"></td>
                        <td className="border border-slate-200"></td>
                        <td className="px-6 py-1 border border-slate-200 text-right text-xs uppercase font-bold">{cat} 小計:</td>
                        <td className="px-6 py-1 border border-slate-200 text-right font-bold">
                          ${catItems.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                <tr className="h-4 bg-slate-100">
                   <td colSpan={4} className="border border-slate-200"></td>
                </tr>
                <tr className="bg-slate-800 text-white font-bold">
                  <td className="border border-slate-700 bg-slate-900"></td>
                  <td colSpan={2} className="px-6 py-3 border border-slate-700 text-right">本月總計支出</td>
                  <td className="px-6 py-3 border border-slate-700 text-right text-xl font-mono">
                    ${record.summary.monthlyTotal.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-green-600 text-white font-bold">
                  <td className="border border-green-700 bg-green-800"></td>
                  <td colSpan={2} className="px-6 py-3 border border-green-700 text-right">本月總計存錢</td>
                  <td className="px-6 py-3 border border-green-700 text-right text-xl font-mono underline underline-offset-4 decoration-white/30">
                    ${record.summary.savingsTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>* 資料包含清單中所有項目</span>
              <span className="flex items-center text-green-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div> XLSX 引擎已啟用
              </span>
            </div>
            <p className="font-mono italic">DATA_ENGINE: V1.6_XLSX_BINARY</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonalFundSheet;