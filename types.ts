export interface Card {
  front: string;
  back: string;
}

export interface Suggestion {
  front: string;
  back: string;
  reason: string;
}

export interface AnalysisResult {
  explanation: string;
  critique: string;
  suggestions: Suggestion[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type Language = 'English' | 'Simplified Chinese' | 'Traditional Chinese' | 'Japanese' | 'Korean' | 'Spanish' | 'French' | 'German';

export type LLMProvider = 'Gemini' | 'OpenAI';

export interface AppSettings {
  provider: LLMProvider;
  apiKey: string; // User provided key. If empty for Gemini, use process.env.API_KEY
  baseUrl?: string; // For OpenAI compatible providers (e.g. OpenRouter)
  model?: string;   // Model name (e.g. gpt-4o, deepseek-r1)
}