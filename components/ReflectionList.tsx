import React, { useState, useMemo } from 'react';
import { Reflection } from '../types';
import { CATEGORIES } from '../constants';

interface ReflectionListProps {
  reflections: Reflection[];
  onDelete: (id: string) => void;
  isPrivacyMode: boolean;
  searchQuery?: string;
}

const ReflectionList: React.FC<ReflectionListProps> = ({ reflections, onDelete, isPrivacyMode, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredReflections = useMemo(() => {
    return reflections.filter(ref => {
        if (selectedCategory && ref.category !== selectedCategory) return false;
        return true;
    });
  }, [reflections, selectedCategory]);

  const HighlightedText = ({ text, query }: { text: string, query?: string }) => {
      if (!query || query.length < 2) return <>{text}</>;
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return <>{parts.map((part, i) => part.toLowerCase() === query.toLowerCase() ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/60 text-slate-900 dark:text-yellow-100 rounded px-0.5">{part}</span> : part)}</>;
  };

  if (reflections.length === 0) return <div className="text-center py-12 text-slate-400 font-serif italic text-lg">Seu diário está esperando por você.</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         <button onClick={() => setSelectedCategory(null)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide border transition-all ${!selectedCategory ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>Todas</button>
         {CATEGORIES.map(cat => (
             <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide border transition-all ${selectedCategory === cat ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>{cat}</button>
         ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
          {filteredReflections.map((ref) => (
            <div key={ref.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative cursor-default">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 transition-colors group-hover:border-slate-200 dark:group-hover:border-slate-700">
                        <span className="text-xl font-bold font-serif">{new Date(ref.date + 'T00:00:00').getDate()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{new Date(ref.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-brand-600/70 dark:text-brand-400/70 group-hover:text-brand-600 dark:group-hover:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md transition-colors duration-300">{ref.category}</span>
                            {ref.mood && <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">{['Awful','Bad','Neutral','Good','Great'].find(m=>m.toLowerCase()===ref.mood)}</span>}
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-1 font-serif tracking-tight transition-colors duration-300"><HighlightedText text={ref.title} query={searchQuery} /></h4>
                    </div>
                </div>
                <button onClick={() => onDelete(ref.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-2 transition-all"><i className="fas fa-trash-alt text-sm"></i></button>
              </div>
              <div className={`prose prose-slate dark:prose-invert max-w-none ${isPrivacyMode ? 'filter blur-md select-none' : ''}`}>
                <p className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed font-serif text-[1.05rem] transition-colors duration-700 ease-out group-hover:text-slate-800 dark:group-hover:text-slate-200"><HighlightedText text={ref.text} query={searchQuery} /></p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default ReflectionList;