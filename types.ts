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