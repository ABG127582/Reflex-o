import React, { useMemo } from 'react';
import { Reflection } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface MoodChartProps {
  reflections: Reflection[];
}

const MoodChart: React.FC<MoodChartProps> = ({ reflections }) => {
  const chartData = useMemo(() => {
    const data = reflections
      .filter(r => r.mood && r.date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    if (data.length < 2) return [];

    const moodMap: Record<string, number> = { 'awful': 1, 'bad': 2, 'neutral': 3, 'good': 4, 'great': 5 };

    return data.map(r => ({
      date: new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: moodMap[r.mood || 'neutral'] || 3,
      label: MOOD_OPTIONS.find(m => m.value === r.mood)?.icon || '😐',
    }));
  }, [reflections]);

  if (chartData.length < 2) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center h-48">
        <i className="fas fa-chart-line text-slate-300 dark:text-slate-600 text-3xl mb-3"></i>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Registre mais reflexões para ver tendências.</p>
      </div>
    );
  }

  const width = 600, height = 200, padding = 20;
  const contentWidth = width - (padding * 2), contentHeight = height - (padding * 2);
  const getX = (i: number) => padding + (i * (contentWidth / (chartData.length - 1)));
  const getY = (val: number) => height - padding - ((val - 1) / 4) * contentHeight;
  const points = chartData.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPath = `${points} L ${getX(chartData.length - 1)},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700">
         <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">Oscilação Emocional</h3>
      </div>
      <div className="p-4 overflow-x-auto">
         <div className="min-w-[600px]">
            <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[1, 2, 3, 4, 5].map(val => (
                    <line key={val} x1={padding} y1={getY(val)} x2={width - padding} y2={getY(val)} stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="1" strokeDasharray="4 4"/>
                ))}
                <path d={areaPath} fill="url(#lineGradient)" />
                <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                {chartData.map((d, i) => (
                    <g key={i} className="group">
                        <circle cx={getX(i)} cy={getY(d.value)} r="4" className="fill-white dark:fill-slate-800 stroke-indigo-500 stroke-2 group-hover:r-6 cursor-pointer transition-all duration-300" />
                        {(chartData.length < 8 || i % 2 === 0) && (
                            <text x={getX(i)} y={height + 15} textAnchor="middle" className="text-[12px] fill-slate-500 dark:fill-slate-400 font-bold">{d.date}</text>
                        )}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <rect x={getX(i) - 25} y={getY(d.value) - 45} width="50" height="35" rx="6" className="fill-slate-800 dark:fill-white drop-shadow-lg" />
                            <text x={getX(i)} y={getY(d.value) - 22} textAnchor="middle" className="text-xl fill-white dark:fill-slate-900 font-sans">{d.label}</text>
                        </g>
                    </g>
                ))}
            </svg>
         </div>
      </div>
    </div>
  );
};

export default MoodChart;