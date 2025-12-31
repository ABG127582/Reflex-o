import React, { useMemo } from 'react';
import { STOIC_QUOTES } from '../constants';

interface DailyQuoteProps {
  onReflect: (text: string) => void;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ onReflect }) => {
  const quote = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return STOIC_QUOTES[dayOfYear % STOIC_QUOTES.length];
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 shadow-xl text-white relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 cursor-default">
      <div className="absolute -top-6 right-4 opacity-5 group-hover:opacity-15 pointer-events-none transition-opacity duration-700">
        <i className="fas fa-quote-right text-9xl"></i>
      </div>
      <div className="relative z-10 flex flex-col items-start text-left pr-8">
        <div className="flex w-full justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-indigo-400/70 group-hover:text-indigo-300 uppercase tracking-[0.3em] font-sans transition-colors duration-500">Sabedoria do Dia</h3>
        </div>
        <p className="text-xl md:text-2xl font-serif leading-relaxed text-slate-300 group-hover:text-slate-50 mb-6 drop-shadow-sm transition-colors duration-700 ease-in-out">"{quote.text}"</p>
        <div className="flex items-center gap-3">
           <div className="h-px w-8 bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors duration-500"></div>
           <span className="text-sm font-medium text-indigo-300/60 group-hover:text-indigo-200 tracking-wide font-sans transition-colors duration-500">{quote.author}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;