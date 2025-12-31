import { GoogleGenAI, Type } from "@google/genai";
import { Reflection, SleepReflectionsData, AIInsightResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBiopsychosocialInsights = async (
  reflections: Reflection[],
  sleepData: SleepReflectionsData,
  targetDate: string
): Promise<AIInsightResult> => {
  try {
    const historicalReflections = reflections
        .filter(r => r.date <= targetDate)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7)
        .map(r => `[${r.date}] (${r.category}) Humor: ${r.mood || 'neutro'} -> ${r.text}`);
    
    const recentRituals = Object.entries(sleepData)
      .filter(([date]) => date <= targetDate)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 5)
      .map(([date, data]) => {
          const completedItems = data.ritual?.filter(i => i.completed).map(i => i.label).join(', ');
          const hasCompleted = completedItems && completedItems.length > 0;
          return `Data: ${date} - Ritual Cumprido: ${hasCompleted ? completedItems : 'Nenhum'}`;
      });

    if (historicalReflections.length === 0 && recentRituals.length === 0) {
        throw new Error("Dados insuficientes nesta data para gerar análise.");
    }

    const prompt = `
      SISTEMA: CONSELHO MULTIDISCIPLINAR DE REVISÃO E APERFEIÇOAMENTO
      DATA DA ANÁLISE: ${targetDate}

      Função:
      Você atua como um conselho profissional multidisciplinar (Psicólogo Cognitivo Comportamental + Filósofo Estoico + Editor Chefe).

      Missão:
      Analisar a ENTRADA fornecida (Reflexões do Diário + Hábitos/Rituais) ATÉ A DATA DE ${targetDate} e entregar:
      1. Diagnóstico objetivo de problemas reais e padrões ocultos.
      2. Uma "Provocação Estoica" (Socrática) que force o usuário a confrontar uma verdade desconfortável sobre este período.
      3. Uma versão refinada do último texto (se houver), elevando a linguagem para algo atemporal.

      DADOS DE ENTRADA (Contexto Histórico):
      - Diário Recente: ${JSON.stringify(historicalReflections)}
      - Hábitos & Rituais: ${JSON.stringify(recentRituals)}

      Regras de Saída (JSON Estrito):
      1. executiveSummary: Síntese curta (max 2 frases).
      2. diagnosis: Lista de problemas lógicos ou emocionais.
      3. weakElements: Trechos que são mera reclamação sem ação.
      4. improvements: Sugestões práticas.
      5. stoicChallenge: Pergunta direta e profunda.
      6. refinedVersion: Texto do usuário reescrito com clareza e dignidade.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.3, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            diagnosis: { type: Type.ARRAY, items: { type: Type.STRING } },
            weakElements: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            stoicChallenge: { type: Type.STRING },
            refinedVersion: { type: Type.STRING }
          },
          required: ["executiveSummary", "diagnosis", "weakElements", "improvements", "stoicChallenge", "refinedVersion"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIInsightResult;
    }
    
    throw new Error("Resposta vazia da IA");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao processar insights. Tente novamente.");
  }
};