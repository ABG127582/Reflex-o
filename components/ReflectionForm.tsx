import React, { useState, useEffect } from 'react';
import { CATEGORIES, REFLECTION_CHECKLISTS } from '../constants';
import { Reflection, RitualItem } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ReflectionFormProps {
  onSave: (reflection: Omit<Reflection, 'id' | 'date' | 'timestamp'>) => void;
  onGenerateInsights: () => void;
  isGenerating: boolean;
  ritualItems?: RitualItem[];
  onToggleRitual?: (id: string) => void;
  externalPrompt?: string | null;
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({ onSave, onGenerateInsights, isGenerating, ritualItems = [], onToggleRitual, externalPrompt }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [mood, setMood] = useState('neutral');
  const [text, setText] = useState('');
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => { if (transcript) setText(prev => (prev ? prev + ' ' + transcript : transcript)); }, [transcript]);
  useEffect(() => { if (externalPrompt) { setText(prev => prev ? `${prev}\n\n${externalPrompt}` : externalPrompt); if (externalPrompt.includes('"')) setCategory('Estoicismo'); } }, [externalPrompt]);

  const handleSave = () => {
    if (!text.trim()) return;
    const title = text.split('\n')[0].substring(0, 50) + (text.length > 50 ? '...' : '');
    onSave({ title, text, category, mood });
    setText(''); setCategory(CATEGORIES[0]); setMood('neutral'); setIsZenMode(false); setSelectedItems(new Set());
  };

  const handleChecklistItemClick = (item: string) => {
    setText(prev => prev ? `${prev}\n✅ ${item}` : `✅ ${item}`);
    setSelectedItems(prev => new Set(prev).add(item));
  };

  return (
    <>
      {isZenMode && (
         <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 md:p-12 animate-in fade-in">
             <div className="w-full max-w-4xl h-full flex flex-col relative space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif text-slate-400">Modo Foco</h2>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-brand-700 transition-colors">Salvar</button>
                        <button onClick={() => setIsZenMode(false)} className="bg-white dark:bg-slate-800 text-slate-400 w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><i className="fas fa-times"></i></button>
                    </div>
                </div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[2rem] p-10 md:p-16 text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-200 resize-none focus:outline-none font-serif border border-slate-100 dark:border-slate-800 shadow-sm" placeholder="Escreva..." autoFocus />
             </div>
         </div>
      )}

      <div className={`space-y-6 ${isZenMode ? 'hidden' : ''}`}>
        <div className="bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
          <button onClick={() => setIsChecklistExpanded(!isChecklistExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors group">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-[0.2em] transition-colors"><i className="fas fa-tools mr-2"></i> Ferramentas</span>
            <i className={`fas fa-chevron-down text-sm transition-transform text-slate-400 ${isChecklistExpanded ? 'rotate-180' : ''}`}></i>
          </button>
          
          <div className={`transition-all duration-300 overflow-hidden ${isChecklistExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-6">
                {ritualItems.length > 0 && onToggleRitual && (
                     <div className="rounded-xl border p-5 flex flex-col gap-4 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
                        <h4 className="text-xs font-black uppercase text-indigo-700/70 dark:text-indigo-300/70 tracking-wider">Ritual de Desligamento</h4>
                        <div className="flex flex-wrap gap-2">
                            {ritualItems.map((item) => (
                                <button 
                                  key={item.id} 
                                  onClick={() => onToggleRitual(item.id)} 
                                  className={`text-sm font-semibold px-4 py-2 rounded-lg border flex items-center gap-2 transition-all duration-300 ${
                                    item.completed 
                                      ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-400 dark:border-indigo-500/50 shadow-sm' 
                                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-indigo-200 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-slate-800 dark:hover:text-slate-200'
                                  }`}
                                >
                                    <i className={`fas ${item.completed ? 'fa-check-square' : 'fa-square opacity-30'}`}></i> {item.label}
                                </button>
                            ))}
                        </div>
                     </div>
                )}
                {Object.entries(REFLECTION_CHECKLISTS).map(([key, data]) => (
                    <div key={key} className="rounded-xl border p-5 flex flex-col gap-4 bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-500 tracking-wider">{data.label}</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.items.map((item, idx) => (
                                <button 
                                  key={idx} 
                                  onClick={() => handleChecklistItemClick(item)} 
                                  className={`text-sm font-semibold px-4 py-2 rounded-lg border flex items-center gap-2 transition-all duration-300 ${
                                    selectedItems.has(item) 
                                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-400 dark:border-slate-500 shadow-sm' 
                                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                                  }`}
                                >
                                    <i className={`fas ${selectedItems.has(item) ? 'fa-check-square' : 'fa-square opacity-30'}`}></i> {item}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl border border-white/50 dark:border-slate-700 p-1">
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[1.4rem] p-6 group">
            <div className="relative">
                <div className="absolute right-2 top-0 flex gap-2 z-10 opacity-70 hover:opacity-100 transition-opacity">
                    <button onClick={() => { setText(''); setSelectedItems(new Set()); }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors" title="Limpar"><i className="fas fa-eraser text-xs"></i></button>
                    <button onClick={() => setIsZenMode(true)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-colors" title="Modo Zen"><i className="fas fa-expand-alt text-xs"></i></button>
                    {hasRecognitionSupport && (
                        <button onClick={isListening ? stopListening : startListening} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${isListening ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600'}`} title="Ditar"><i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-xs`}></i></button>
                    )}
                </div>
                <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Como você está se sentindo hoje?" className="w-full bg-transparent border-none py-4 pr-12 pl-2 focus:outline-none resize-none font-serif text-lg md:text-xl leading-8 text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:italic transition-colors duration-500 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                 <button onClick={onGenerateInsights} disabled={isGenerating} className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm"><i className="fas fa-magic mr-2 text-brand-500"></i> {isGenerating ? 'Analisando...' : 'Insights'}</button>
                 <button onClick={handleSave} disabled={!text} className="px-8 py-2.5 bg-brand-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-700 disabled:opacity-50 transition-all shadow-md shadow-brand-500/20"><i className="fas fa-save mr-2"></i> Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReflectionForm;