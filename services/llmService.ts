import { AnalysisResult, Language, AppSettings } from "../types";
import { analyzeWithGemini } from "./geminiService";
import { analyzeWithOpenAI } from "./openaiService";

export const analyzeAnkiCard = async (
  front: string, 
  back: string, 
  language: Language, 
  settings: AppSettings
): Promise<AnalysisResult> => {
  const { provider, apiKey, baseUrl, model } = settings;

  if (provider === 'OpenAI') {
    return analyzeWithOpenAI(front, back, language, apiKey, baseUrl, model);
  } else {
    // Gemini is default
    // We pass the apiKey if it exists, otherwise the service uses the env var default
    return analyzeWithGemini(front, back, language, apiKey);
  }
};