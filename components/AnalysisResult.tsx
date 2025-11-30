import React, { useState } from 'react';
import { parse } from 'marked';
import { AnalysisResult as AnalysisResultType, Suggestion } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
}

const MarkdownContent: React.FC<{ content: string; className?: string }> = ({ content, className = "" }) => {
  const html = parse(content) as string;
  return (
    <div 
      className={`
        [&>p]:mb-3 [&>p:last-child]:mb-0 
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
        [&>li]:mb-1
        [&>strong]:font-semibold [&>strong]:text-zinc-900
        [&>em]:italic
        [&>code]:bg-zinc-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono [&>code]:text-zinc-600
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Concept Explanation */}
      <section className="relative">
        <div className="absolute -left-6 top-1.5 w-1 h-6 bg-indigo-500 rounded-full hidden lg:block"></div>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Core Concept</h3>
        <div className="text-zinc-800 leading-8 text-lg font-light">
          <MarkdownContent content={result.explanation} />
        </div>
      </section>

      {/* Critique */}
      <section>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Critique</h3>
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-soft text-zinc-600 leading-relaxed">
          <div className="relative pl-6">
            <span className="absolute left-0 top-0 text-3xl text-zinc-200 font-serif">"</span>
            <MarkdownContent content={result.critique} className="italic" />
          </div>
        </div>
      </section>

      {/* Suggested Improvements */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Refined Versions</h3>
          <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{result.suggestions.length} CARDS</span>
        </div>
        
        <div className="grid grid-cols-1 gap-10">
          {result.suggestions.map((suggestion, index) => (
            <SuggestedCard key={index} suggestion={suggestion} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

const CopyButton: React.FC<{ text: string, label: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`group relative text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 border
        ${copied 
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
          : 'bg-white text-zinc-400 border-zinc-200 hover:text-zinc-700 hover:border-zinc-300'
        }`}
    >
      <span className={copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-2 whitespace-nowrap'}>
         {copied ? 'Copied!' : ''}
      </span>
      <span>{label}</span>
      {copied ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
      )}
    </button>
  );
};

const SuggestedCard: React.FC<{ suggestion: Suggestion; index: number }> = ({ suggestion, index }) => {
  return (
    <div className="relative group">
      {/* Decorative Index */}
      <div className="absolute -left-12 top-0 text-6xl font-bold text-zinc-100 -z-10 font-serif select-none hidden xl:block">
        0{index + 1}
      </div>

      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          {/* Front */}
          <div className="p-8 flex flex-col h-full min-h-[250px]">
             <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Front</span>
               <CopyButton text={suggestion.front} label="Copy HTML" />
             </div>
             {/* Render HTML Preview */}
             <div 
               className="flex-grow flex flex-col items-center justify-center text-center text-zinc-800 text-xl font-serif leading-relaxed w-full break-words [&>img]:max-w-full"
               dangerouslySetInnerHTML={{ __html: suggestion.front }}
             />
          </div>

          {/* Back */}
          <div className="p-8 flex flex-col h-full bg-zinc-50/30 min-h-[250px]">
             <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Back</span>
               <CopyButton text={suggestion.back} label="Copy HTML" />
             </div>
             {/* Render HTML Preview */}
             <div 
               className="flex-grow flex flex-col items-center justify-center text-center text-zinc-700 text-lg leading-relaxed font-serif w-full break-words [&>img]:max-w-full"
               dangerouslySetInnerHTML={{ __html: suggestion.back }}
             />
          </div>
        </div>
        
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-start gap-3">
          <svg className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-sm text-zinc-500">
            {suggestion.reason}
          </p>
        </div>
      </div>
    </div>
  );
};