import React from 'react';
import { LoadingState, Language } from '../types';

interface CardInputProps {
  front: string;
  setFront: (value: string) => void;
  back: string;
  setBack: (value: string) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  onAnalyze: () => void;
  loadingState: LoadingState;
}

const LANGUAGES: Language[] = [
  'Simplified Chinese',
  'Traditional Chinese',
  'English',
  'Japanese',
  'Korean',
  'Spanish',
  'French',
  'German'
];

export const CardInput: React.FC<CardInputProps> = ({
  front,
  setFront,
  back,
  setBack,
  language,
  setLanguage,
  onAnalyze,
  loadingState
}) => {
  const isThinking = loadingState === LoadingState.THINKING;

  return (
    <div className="flex flex-col h-full space-y-8">
      
      {/* Controls */}
      <div className="flex items-center justify-end">
         <div className="relative group">
           <select
             id="language"
             value={language}
             onChange={(e) => setLanguage(e.target.value as Language)}
             disabled={isThinking}
             className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer focus:outline-none transition-colors"
           >
             {LANGUAGES.map(lang => (
               <option key={lang} value={lang}>{lang}</option>
             ))}
           </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
             <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </div>
         </div>
      </div>
      
      {/* Input Fields */}
      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="front" className="absolute -top-2.5 left-3 bg-zinc-50 px-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest z-10">Front</label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Enter the front content of your card..."
            className="w-full p-5 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all min-h-[160px] resize-y text-zinc-800 placeholder:text-zinc-300 text-base shadow-sm font-serif leading-relaxed"
            disabled={isThinking}
          />
        </div>

        <div className="relative">
          <label htmlFor="back" className="absolute -top-2.5 left-3 bg-zinc-50 px-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest z-10">Back</label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Enter the answer or back content..."
            className="w-full p-5 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all min-h-[160px] resize-y text-zinc-800 placeholder:text-zinc-300 text-base shadow-sm font-serif leading-relaxed"
            disabled={isThinking}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <button
          onClick={onAnalyze}
          disabled={isThinking || !front.trim() || !back.trim()}
          className={`w-full py-4 px-6 rounded-xl font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2
            ${isThinking || !front.trim() || !back.trim()
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
              : 'bg-zinc-900 text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
            }`}
        >
          {isThinking ? 'Refining...' : 'Refine Card'}
        </button>
      </div>
    </div>
  );
};