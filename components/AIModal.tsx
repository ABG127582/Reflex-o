import React from 'react';
import { AIInsightResult } from '../types';

interface AIModalProps {
  isOpen: boolean;
  content: AIInsightResult | null;
  onClose: () => void;
  isLoading: boolean;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, content, onClose, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-bold uppercase text-slate-800 dark:text-slate-100"><i className="fas fa-gavel mr-2"></i> Conselho de Revisão</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
        </div>

        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
              <i className="fas fa-circle-notch fa-spin text-3xl"></i>
              <p>O Conselho está deliberando...</p>
            </div>
          ) : content ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                <div className="p-8 group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resumo Executivo</h3>
                   <p className="text-lg font-serif text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-500">{content.executiveSummary}</p>
                </div>
                <div className="p-8 bg-slate-900 text-white relative overflow-hidden group">
                    <h3 className="text-xs font-black text-indigo-400/70 group-hover:text-indigo-400 uppercase tracking-widest mb-4 z-10 relative transition-colors">Desafio Socrático</h3>
                    <p className="text-2xl font-serif italic z-10 relative border-l-4 border-indigo-500 pl-6 text-slate-300 group-hover:text-white transition-colors duration-500">"{content.stoicChallenge}"</p>
                    <i className="fas fa-quote-right absolute -bottom-5 right-5 text-8xl opacity-5 group-hover:opacity-10 transition-opacity duration-700"></i>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                    <div className="p-8 bg-amber-50 dark:bg-amber-900/10 group">
                        <h3 className="text-xs font-black text-amber-600/70 group-hover:text-amber-600 uppercase tracking-widest mb-4 transition-colors">Diagnóstico</h3>
                        <ul className="space-y-3">
                            {content.diagnosis.map((i,x)=> (
                                <li key={x} className="text-sm text-slate-600/80 dark:text-slate-400/80 group-hover:text-slate-800 dark:group-hover:text-slate-200 flex gap-2 transition-colors duration-300">
                                    <i className="fas fa-exclamation-triangle text-amber-500 text-xs mt-1 opacity-70 group-hover:opacity-100"></i> {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 group">
                        <h3 className="text-xs font-black text-emerald-600/70 group-hover:text-emerald-600 uppercase tracking-widest mb-4 transition-colors">Plano de Ação</h3>
                        <ul className="space-y-3">
                            {content.improvements.map((i,x)=> (
                                <li key={x} className="text-sm text-slate-600/80 dark:text-slate-400/80 group-hover:text-slate-800 dark:group-hover:text-slate-200 flex gap-2 transition-colors duration-300">
                                    <i className="fas fa-check text-emerald-500 text-xs mt-1 opacity-70 group-hover:opacity-100"></i> {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a] group">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center opacity-70 group-hover:opacity-100 transition-opacity">Versão Refinada</h3>
                   <p className="font-serif text-lg leading-relaxed text-justify text-slate-500 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors duration-700 ease-out">{content.refinedVersion}</p>
                </div>
            </div>
          ) : <div className="p-10 text-center text-slate-400">Sem dados.</div>}
        </div>
      </div>
    </div>
  );
};
export default AIModal;