import React, { useState } from 'react';
import { CardInput } from './components/CardInput';
import { AnalysisResult } from './components/AnalysisResult';
import { SettingsModal } from './components/SettingsModal';
import { analyzeAnkiCard } from './services/llmService';
import { AnalysisResult as AnalysisResultType, LoadingState, Language, AppSettings } from './types';

function App() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [language, setLanguage] = useState<Language>('Simplified Chinese');
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    provider: 'Gemini',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o'
  });

  const handleAnalyze = async () => {
    setLoadingState(LoadingState.THINKING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeAnkiCard(front, back, language, settings);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to refine card. Please check your connection or settings.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-zinc-200 selection:text-zinc-900">
      <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-baseline justify-between border-b border-zinc-200 pb-6 relative">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-zinc-900">
              Anki <span className="font-semibold">Refine</span>
            </h1>
            <p className="mt-2 text-zinc-500 text-sm">Intelligent flashcard optimization</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-all"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
            
            <div className="hidden md:block">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                Powered by {settings.provider}
              </span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-12">
            <CardInput
              front={front}
              setFront={setFront}
              back={back}
              setBack={setBack}
              language={language}
              setLanguage={setLanguage}
              onAnalyze={handleAnalyze}
              loadingState={loadingState}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 min-h-[500px]">
             {loadingState === LoadingState.IDLE && (
               <div className="h-full flex flex-col items-center justify-center text-zinc-300 border-2 border-dashed border-zinc-100 rounded-2xl p-12 text-center">
                 <svg className="w-12 h-12 mb-4 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                 </svg>
                 <p className="text-sm font-medium">Enter your card details to begin refinement</p>
                 <p className="text-xs text-zinc-400 mt-2">Using {settings.provider}</p>
               </div>
             )}

             {loadingState === LoadingState.THINKING && (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-t-2 border-zinc-900 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-t-2 border-zinc-400 rounded-full animate-spin direction-reverse"></div>
                  </div>
                  <p className="text-zinc-600 font-medium animate-pulse">
                    {settings.provider === 'Gemini' ? 'Reasoning...' : 'Analyzing...'}
                  </p>
                  <p className="text-zinc-400 text-xs mt-2">Applying learning principles</p>
                </div>
             )}

             {loadingState === LoadingState.ERROR && (
               <div className="bg-rose-50 border border-rose-100 rounded-xl p-8 text-rose-900 text-center">
                 <p className="font-semibold mb-2">Refinement Interrupted</p>
                 <p className="text-sm opacity-80 mb-6">{error}</p>
                 <button 
                   onClick={handleAnalyze} 
                   className="px-4 py-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all text-rose-700"
                 >
                   Try Again
                 </button>
               </div>
             )}

             {loadingState === LoadingState.SUCCESS && (
               <AnalysisResult result={result} />
             )}
          </div>
        </main>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

export default App;