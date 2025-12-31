import React, { useState, useRef, useEffect } from 'react';
import ReflectionForm from './components/ReflectionForm';
import ReflectionList from './components/ReflectionList';
import HabitHeatmap from './components/HabitHeatmap';
import MoodChart from './components/MoodChart';
import DailyQuote from './components/DailyQuote';
import AIModal from './components/AIModal';
import Toast from './components/Toast';
import { useMindfulState } from './hooks/useMindfulState';
import { generateBiopsychosocialInsights } from './services/geminiService';
import { getTodayStr } from './types';
import { DEFAULT_RITUAL_ITEMS } from './constants';

type ViewState = 'journal' | 'tools';

const App: React.FC = () => {
  const { 
    reflections, sleepData, streak, selectedDate, setSelectedDate,
    addReflection, deleteReflection, toggleRitualItem, saveDailyInsight, exportData, importData
  } = useMindfulState();

  const [currentView, setCurrentView] = useState<ViewState>('journal');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('mindful_theme') !== 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState<any | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toast, setToast] = useState<any | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('mindful_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => setToast({ id: crypto.randomUUID(), message, type });

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && confirm("Mesclar dados?")) {
        const success = await importData(e.target.files[0]);
        showToast(success ? "Restaurado!" : "Erro.", success ? "success" : "error");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenAIModal = async (force = false) => {
    setIsAIModalOpen(true);
    const saved = sleepData[selectedDate]?.dailyInsight;
    if (!force && saved) { setAiContent(saved); return; }
    
    setIsGeneratingAI(true);
    try {
      const insight = await generateBiopsychosocialInsights(reflections, sleepData, selectedDate);
      setAiContent(insight); saveDailyInsight(insight); showToast('Insights gerados.', 'success');
    } catch { showToast('Erro na IA.', 'error'); setAiContent(null); } 
    finally { setIsGeneratingAI(false); }
  };

  const currentDayData = sleepData[selectedDate] || { ritual: [] };
  const displayRitualItems = currentDayData.ritual?.length ? currentDayData.ritual : DEFAULT_RITUAL_ITEMS.map(i => ({...i}));
  const filteredReflections = reflections.filter(r => searchQuery === '' || r.text.toLowerCase().includes(searchQuery.toLowerCase()));
  const isEditingToday = selectedDate === getTodayStr();

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500 dark:bg-slate-900 flex flex-col text-slate-700 dark:text-slate-200 font-sans selection:bg-brand-200 dark:selection:bg-brand-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 font-serif italic text-2xl font-bold cursor-pointer text-slate-800 dark:text-slate-100 tracking-tight" onClick={() => setCurrentView('journal')}>
            <div className="bg-brand-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-lg shadow-brand-500/30"><i className="fas fa-feather-alt"></i></div>
            <span className="hidden sm:inline">Reflexão</span>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['journal', 'tools'].map(v => (
                <button key={v} onClick={() => setCurrentView(v as ViewState)} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${currentView === v ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    {v === 'journal' ? 'Diário' : 'Ferramentas'}
                </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"><i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i></button>
            <button onClick={() => setIsPrivacyMode(!isPrivacyMode)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isPrivacyMode ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><i className={`fas ${isPrivacyMode ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300"><i className="fas fa-fire text-orange-500"></i> {streak}</div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 w-full flex-grow pt-28 pb-12">
          {currentView === 'journal' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DailyQuote onReflect={txt => { setActivePrompt(txt); window.scrollTo({top: 350, behavior:'smooth'}); }} />
                {!isEditingToday && (
                    <div className="mt-6 flex justify-center">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-full px-6 py-2 flex items-center gap-3 text-sm font-bold text-amber-700 dark:text-amber-400 shadow-sm">
                            <span><i className="fas fa-history mr-2"></i>Editando: {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                            <button onClick={() => setSelectedDate(getTodayStr())} className="hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-full w-6 h-6 flex items-center justify-center"><i className="fas fa-times"></i></button>
                        </div>
                    </div>
                )}
                <div className="mt-10 flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">Diário</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-serif italic">Escreva sua história, um dia de cada vez.</p>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{isEditingToday ? 'Hoje' : selectedDate}</span>
                </div>
                <ReflectionForm onSave={(d) => { addReflection(d); showToast('Salvo', 'success'); setActivePrompt(null); }} onGenerateInsights={() => handleOpenAIModal(true)} isGenerating={isGeneratingAI} ritualItems={displayRitualItems} onToggleRitual={toggleRitualItem} externalPrompt={activePrompt} />
                
                <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-serif text-slate-800 dark:text-slate-100">Memórias</h2>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" placeholder="Pesquisar memórias..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
                        </div>
                    </div>
                    <ReflectionList reflections={filteredReflections} onDelete={(id) => { if(confirm("Apagar?")) { deleteReflection(id); showToast("Apagado", 'info'); }}} isPrivacyMode={isPrivacyMode} searchQuery={searchQuery} />
                </div>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
                 <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                     <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">Ferramentas</h2>
                     <p className="text-slate-500 dark:text-slate-400 mt-1 font-serif italic">Análise de hábitos e saúde emocional.</p>
                 </div>
                 <HabitHeatmap reflections={reflections} sleepData={sleepData} selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setCurrentView('journal'); }} />
                 <MoodChart reflections={reflections} />
                 <div className="grid sm:grid-cols-2 gap-6">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><i className="fas fa-cloud-download-alt text-xl"></i></div>
                        <h3 className="font-bold text-lg mb-1">Backup dos Dados</h3>
                        <p className="text-sm text-slate-500 mb-6">Baixe uma cópia segura de todas as suas reflexões e hábitos em formato JSON.</p>
                        <button onClick={exportData} className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Baixar Arquivo</button>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><i className="fas fa-file-upload text-xl"></i></div>
                        <h3 className="font-bold text-lg mb-1">Restaurar Backup</h3>
                        <p className="text-sm text-slate-500 mb-6">Importe um arquivo JSON gerado anteriormente para recuperar suas memórias.</p>
                        <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">Selecionar Arquivo</button>
                     </div>
                 </div>
              </div>
          )}
      </div>

      <AIModal isOpen={isAIModalOpen} isLoading={isGeneratingAI} content={aiContent} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default App;