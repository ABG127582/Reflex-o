export interface Reflection {
  id: string;
  title: string;
  text: string;
  category: string;
  mood?: string; // 'awful' | 'bad' | 'neutral' | 'good' | 'great'
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface RitualItem {
  id: string;
  label: string;
  completed: boolean;
  category?: string;
}

export interface AIInsightResult {
  executiveSummary: string;
  diagnosis: string[];
  weakElements: string;
  improvements: string[];
  stoicChallenge: string;
  refinedVersion: string;
  generatedAt?: number;
}

export interface SleepDataDay {
  ritual: RitualItem[];
  dailyInsight?: AIInsightResult;
}

export interface SleepReflectionsData {
  [date: string]: SleepDataDay; // key is YYYY-MM-DD
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Helper to get local date string YYYY-MM-DD
export const getTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};