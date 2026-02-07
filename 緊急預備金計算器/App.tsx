import React, { useState, useMemo, useEffect } from 'react';
import { ExpenseItem, Category, SavedRecord } from './types';
import ExpenseTable from './components/ExpenseTable';
import SummarySection from './components/SummarySection';
import AIAdvice from './components/AIAdvice';
import PersonalFundSheet from './components/PersonalFundSheet';

const INITIAL_EXPENSES: ExpenseItem[] = [
  // Fixed
  { id: '1', category: Category.FIXED, name: '手機費', amount: 699, included: true },
  { id: '2', category: Category.FIXED, name: '房租', amount: 12000, included: true },
  { id: '3', category: Category.FIXED, name: '保費', amount: 4583, included: true },
  { id: '4', category: Category.FIXED, name: '定期定額投資', amount: 5000, included: true },
  // Living
  { id: '5', category: Category.LIVING, name: '餐費', amount: 9000, included: true },
  { id: '6', category: Category.LIVING, name: '日常用品', amount: 2000, included: true },
  { id: '7', category: Category.LIVING, name: '交通費', amount: 1500, included: true },
  // Savings
  { id: '10', category: Category.SAVINGS, name: '緊急預備金存款', amount: 5000, included: true },
  { id: '11', category: Category.SAVINGS, name: '旅遊基金', amount: 2000, included: true },
  // Debt
  { id: '14', category: Category.LONG_TERM_DEBT, name: '學貸', amount: 3500, included: true },
];

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('budget_records');
    if (saved) {
      try {
        setSavedRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load records", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budget_records', JSON.stringify(savedRecords));
  }, [savedRecords]);

  const updateItem = (id: string, updates: Partial<ExpenseItem>) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const addItem = (category: Category) => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      name: '',
      amount: 0,
      included: true
    };
    setExpenses(prev => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  const summary = useMemo(() => {
    const getSum = (cat: Category) => 
      expenses.filter(e => e.category === cat && e.included).reduce((acc, curr) => acc + curr.amount, 0);

    const fixedTotal = getSum(Category.FIXED);
    const livingTotal = getSum(Category.LIVING);
    const savingsTotal = getSum(Category.SAVINGS);
    const debtTotal = getSum(Category.LONG_TERM_DEBT) + getSum(Category.SHORT_TERM_DEBT);
    
    return {
      fixedTotal,
      livingTotal,
      debtTotal,
      savingsTotal,
      monthlyTotal: fixedTotal + livingTotal + debtTotal
    };
  }, [expenses]);

  const handleConfirm = () => {
    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-TW'),
      monthlyTotal: summary.monthlyTotal,
      savingsTotal: summary.savingsTotal,
      targetFund: 0, // No longer used in UI but kept in type for compatibility
      multiplier: 0, 
      details: expenses.filter(e => e.included && e.amount > 0).map(e => e.name).join(', ')
    };
    setSavedRecords([newRecord, ...savedRecords]);
    alert("已將數據存入個人資金管理表格！");
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords(savedRecords.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-pink-700 mb-2 tracking-tight">
          預算分配
        </h1>
        <p className="text-pink-600 font-medium">清晰掌握每一分錢的去向</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-pink-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ExpenseTable 
                  title="固定支出" 
                  items={expenses.filter(e => e.category === Category.FIXED)} 
                  onUpdate={updateItem} 
                  onAdd={() => addItem(Category.FIXED)}
                  onDelete={deleteItem}
                  themeColor="bg-blue-50"
                  accentColor="text-blue-600"
                />
                <ExpenseTable 
                  title="生活預算" 
                  items={expenses.filter(e => e.category === Category.LIVING)} 
                  onUpdate={updateItem} 
                  onAdd={() => addItem(Category.LIVING)}
                  onDelete={deleteItem}
                  themeColor="bg-green-50"
                  accentColor="text-green-600"
                />
              </div>

              <div className="space-y-8">
                <ExpenseTable 
                  title="預存預算、投資、存錢" 
                  items={expenses.filter(e => e.category === Category.SAVINGS)} 
                  onUpdate={updateItem} 
                  onAdd={() => addItem(Category.SAVINGS)}
                  onDelete={deleteItem}
                  themeColor="bg-purple-50"
                  accentColor="text-purple-600"
                />
                <div className="space-y-4">
                  <ExpenseTable 
                    title="短期債務" 
                    items={expenses.filter(e => e.category === Category.SHORT_TERM_DEBT)} 
                    onUpdate={updateItem} 
                    onAdd={() => addItem(Category.SHORT_TERM_DEBT)}
                    onDelete={deleteItem}
                    themeColor="bg-amber-50"
                    accentColor="text-amber-600"
                  />
                  <ExpenseTable 
                    title="長期債務" 
                    items={expenses.filter(e => e.category === Category.LONG_TERM_DEBT)} 
                    onUpdate={updateItem} 
                    onAdd={() => addItem(Category.LONG_TERM_DEBT)}
                    onDelete={deleteItem}
                    themeColor="bg-orange-50"
                    accentColor="text-orange-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SummarySection 
            summary={summary} 
            onConfirm={handleConfirm}
          />
          <AIAdvice expenses={expenses} summary={summary} />
        </div>
      </div>

      <div className="mt-8">
        <PersonalFundSheet records={savedRecords} onDelete={handleDeleteRecord} />
      </div>

