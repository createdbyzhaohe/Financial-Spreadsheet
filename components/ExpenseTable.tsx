
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExpenseItem } from '../types';

interface ExpenseTableProps {
  title: string;
  items: ExpenseItem[];
  onUpdate: (id: string, updates: Partial<ExpenseItem>) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  themeColor: string;
  accentColor: string;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ 
  title, 
  items, 
  onUpdate, 
  onAdd, 
  onDelete,
  themeColor,
  accentColor
}) => {
  return (
    <div className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm ${themeColor}`}>
      <div className="p-3 flex justify-between items-center border-b border-gray-100 bg-white/50">
        <h3 className={`font-bold ${accentColor}`}>{title}</h3>
        <button 
          onClick={onAdd}
          className={`p-1 rounded-full hover:bg-white transition-colors ${accentColor}`}
          title="新增項目"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-3 py-2 font-medium">項目</th>
            <th className="px-3 py-2 font-medium">金額</th>
            <th className="px-3 py-2 font-medium text-center">列入</th>
            <th className="px-2 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white/30">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-white/50 transition-colors">
              <td className="px-3 py-2">
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                  placeholder="輸入名稱..."
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-300 py-1"
                />
              </td>
              <td className="px-3 py-2">
                <input 
                  type="number" 
                  value={item.amount || ''} 
                  onChange={(e) => onUpdate(item.id, { amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium py-1"
                />
              </td>
              <td className="px-3 py-2 text-center">
                <input 
                  type="checkbox" 
                  checked={item.included} 
                  onChange={(e) => onUpdate(item.id, { included: e.target.checked })}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
              </td>
              <td className="px-2 py-2">
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-gray-400 text-sm">
                尚無項目，點擊右上角新增
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
