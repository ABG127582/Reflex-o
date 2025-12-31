import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { Reflection, SleepReflectionsData, getTodayStr, AIInsightResult } from '../types';
import { STORAGE_KEYS, DEFAULT_RITUAL_ITEMS } from '../constants';

export const useMindfulState = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [sleepData, setSleepData] = useState<SleepReflectionsData>({});
  const [streak, setStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  useEffect(() => {
    const loadedReflections = storageService.get<Reflection[]>(STORAGE_KEYS.UNIFIED_REFLECTIONS) || [];
    loadedReflections.sort((a, b) => b.timestamp - a.timestamp);
    setReflections(loadedReflections);

    const loadedSleep = storageService.get<SleepReflectionsData>(STORAGE_KEYS.SLEEP_REFLECTIONS) || {};
    setSleepData(loadedSleep);
    calculateStreak(loadedReflections, loadedSleep);
  }, []);

  useEffect(() => {
    setSleepData(currentData => {
        if (!currentData[selectedDate]) {
            const newData = {
                ...currentData,
                [selectedDate]: {
                    ritual: DEFAULT_RITUAL_ITEMS.map(i => ({...i})),
                    dailyInsight: undefined
                }
            };
            return newData; 
        }
        return currentData;
    });
  }, [selectedDate]);

  const addReflection = (data: Omit<Reflection, 'id' | 'date' | 'timestamp'>) => {
    const newReflection: Reflection = {
      id: crypto.randomUUID(),
      date: selectedDate,
      timestamp: Date.now(),
      ...data
    };
    const updated = [newReflection, ...reflections];
    setReflections(updated);
    storageService.set(STORAGE_KEYS.UNIFIED_REFLECTIONS, updated);
    calculateStreak(updated, sleepData);
  };

  const deleteReflection = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    storageService.set(STORAGE_KEYS.UNIFIED_REFLECTIONS, updated);
  };

  const toggleRitualItem = (id: string) => {
    const currentDayData = sleepData[selectedDate] 
        ? { ...sleepData[selectedDate] }
        : { ritual: DEFAULT_RITUAL_ITEMS.map(i=>({...i})), dailyInsight: undefined };

    if (!currentDayData.ritual) {
        currentDayData.ritual = DEFAULT_RITUAL_ITEMS.map(i => ({...i}));
    }

    const idx = currentDayData.ritual.findIndex(i => i.id === id);
    if (idx > -1) {
      currentDayData.ritual[idx].completed = !currentDayData.ritual[idx].completed;
      const updated = { ...sleepData, [selectedDate]: currentDayData };
      setSleepData(updated);
      storageService.set(STORAGE_KEYS.SLEEP_REFLECTIONS, updated);
      calculateStreak(reflections, updated);
    }
  };

  const saveDailyInsight = (insight: AIInsightResult) => {
    const currentDayData = sleepData[selectedDate] ? { ...sleepData[selectedDate] } : { ritual: [], dailyInsight: undefined };
    // @ts-ignore
    currentDayData.dailyInsight = { ...insight, generatedAt: Date.now() };
    
    const updated = { ...sleepData, [selectedDate]: currentDayData };
    setSleepData(updated);
    storageService.set(STORAGE_KEYS.SLEEP_REFLECTIONS, updated);
  };

  const exportData = () => {
    const data = {
      reflections,
      sleepData,
      exportedAt: new Date().toISOString(),
      appVersion: '2.5.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-backup-${selectedDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importData = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (!parsed.reflections || !parsed.sleepData) throw new Error("Inválido");

          const existingIds = new Set(reflections.map(r => r.id));
          const newReflections = parsed.reflections.filter((r: Reflection) => !existingIds.has(r.id));
          const mergedReflections = [...newReflections, ...reflections].sort((a, b) => b.timestamp - a.timestamp);
          const mergedSleepData = { ...sleepData, ...parsed.sleepData };

          storageService.set(STORAGE_KEYS.UNIFIED_REFLECTIONS, mergedReflections);
          storageService.set(STORAGE_KEYS.SLEEP_REFLECTIONS, mergedSleepData);
          setReflections(mergedReflections);
          setSleepData(mergedSleepData);
          calculateStreak(mergedReflections, mergedSleepData);
          resolve(true);
        } catch { resolve(false); }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  const calculateStreak = (refs: Reflection[], sleep: SleepReflectionsData) => {
    const activeDates = new Set<string>();
    refs.forEach(r => activeDates.add(r.date));
    Object.keys(sleep).forEach(date => {
      if (sleep[date].ritual?.some(r => r.completed)) activeDates.add(date);
    });

    const todayStr = getTodayStr();
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    const yesterdayStr = yest.toISOString().split('T')[0];

    if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
        setStreak(0);
        return;
    }

    let currentStreak = 0;
    let checkDate = new Date(activeDates.has(todayStr) ? todayStr : yesterdayStr);
    while (currentStreak < 1000) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    setStreak(currentStreak);
  };

  return { reflections, sleepData, streak, selectedDate, setSelectedDate, addReflection, deleteReflection, toggleRitualItem, saveDailyInsight, exportData, importData };
};