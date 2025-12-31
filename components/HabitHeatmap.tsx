import React, { useState, useMemo } from 'react';
import { Reflection, SleepReflectionsData } from '../types';

interface HabitHeatmapProps {
  reflections: Reflection[];
  sleepData: SleepReflectionsData;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ reflections, sleepData, selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  const efficiency = useMemo(() => {
    let completedDays = 0;
    const daysToIterate = isCurrentMonth ? new Date().getDate() : daysInMonth;
    for (let i = 1; i <= daysToIterate; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (reflections.some(r => r.date === dateStr) || sleepData[dateStr]?.ritual?.some(r => r.completed)) completedDays++;
    }
    return Math.round((completedDays / daysToIterate) * 100) || 0;
  }, [year, month, reflections, sleepData]);

  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (reflections.some(r => r.date === dateStr)) return 'complete'; 
    if (sleepData[dateStr]?.ritual?.some(r => r.completed)) return 'partial';
    return 'empty';
  };

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-offset-2 ring-brand-600 scale-110 z-10';
    switch (status) {
      case 'complete': return 'bg-brand-500 shadow-sm border-brand-600';
      case 'partial': return 'bg-brand-200 dark:bg-brand-900 opacity-80';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <i className="fas fa-calendar-check text-lg"></i>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">Consistência</h3>
                <span className={`text-sm font-bold ${efficiency >= 80 ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>{efficiency}% Eficiência</span>
            </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-0.5">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-9 h-9 flex justify-center items-center rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-400"><i className="fas fa-chevron-left text-xs"></i></button>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 min-w-[100px] text-center uppercase">{currentDate.toLocaleString('pt-BR', { month: 'long' })}</span>
            <button onClick={() => { if(!isCurrentMonth) setCurrentDate(new Date(year, month + 1, 1)) }} disabled={isCurrentMonth} className="w-9 h-9 flex justify-center items-center rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-400 disabled:opacity-20"><i className="fas fa-chevron-right text-xs"></i></button>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3">
            {['D','S','T','Q','Q','S','S'].map((d,i) => <span key={i} className="text-sm text-center font-bold text-slate-500 dark:text-slate-400">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {days.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = getDayStatus(day);
            return (
                <button key={day} onClick={() => new Date(dateStr) <= new Date() && onSelectDate(dateStr)} disabled={new Date(dateStr) > new Date()} className={`flex flex-col items-center justify-center rounded-xl transition-all aspect-square ${getStatusColor(status, selectedDate === dateStr)} disabled:opacity-20`}>
                  <span className={`text-sm font-bold ${selectedDate === dateStr || status === 'complete' ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>{day}</span>
                </button>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default HabitHeatmap;