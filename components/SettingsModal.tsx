import React, { useState, useEffect } from 'react';
import { AppSettings, LLMProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [provider, setProvider] = useState<LLMProvider>(settings.provider);
  const [apiKey, setApiKey] = useState<string>(settings.apiKey);
  const [baseUrl, setBaseUrl] = useState<string>(settings.baseUrl || "https://api.openai.com/v1");
  const [model, setModel] = useState<string>(settings.model || "gpt-4o");

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
      setBaseUrl(settings.baseUrl || "https://api.openai.com/v1");
      setModel(settings.model || "gpt-4o");
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ provider, apiKey, baseUrl, model });
    onClose();
  };

  const setPreset = (type: 'openai' | 'openrouter') => {
    if (type === 'openai') {
      setBaseUrl("https://api.openai.com/v1");
      setModel("gpt-4o");
    } else if (type === 'openrouter') {
      setBaseUrl("https://openrouter.ai/api/v1");
      setModel("google/gemini-2.0-flash-thinking-exp:free");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-lg font-semibold text-zinc-900">Settings</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">AI Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider('Gemini')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  provider === 'Gemini' 
                    ? 'border-indigo-500 bg-indigo-50/30 text-indigo-700' 
                    : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'
                }`}
              >
                <div className="font-semibold text-sm">Google Gemini</div>
                <div className="text-[10px] opacity-70 mt-1">Thinking Mode</div>
              </button>

              <button
                onClick={() => setProvider('OpenAI')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  provider === 'OpenAI' 
                    ? 'border-indigo-500 bg-indigo-50/30 text-indigo-700' 
                    : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'
                }`}
              >
                <div className="font-semibold text-sm">OpenAI Compatible</div>
                <div className="text-[10px] opacity-70 mt-1">OpenRouter / GPT / etc</div>
              </button>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-4">
            
            {provider === 'OpenAI' && (
              <div className="flex gap-2 mb-2">
                <button type="button" onClick={() => setPreset('openai')} className="text-[10px] px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded">Use OpenAI Default</button>
                <button type="button" onClick={() => setPreset('openrouter')} className="text-[10px] px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded">Use OpenRouter Preset</button>
              </div>
            )}

            {/* API Key */}
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'Gemini' ? "Optional (Uses built-in)" : "sk-..."}
                className="w-full pl-4 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-sm outline-none placeholder:text-zinc-400 font-mono"
              />
              <p className="text-[10px] text-zinc-500">
                {provider === 'Gemini' 
                  ? "Leave empty to use the system default key." 
                  : "Required for OpenAI/OpenRouter."}
              </p>
            </div>

            {/* Advanced Fields for OpenAI */}
            {provider === 'OpenAI' && (
              <>
                <div className="space-y-2 animate-fadeIn">
                  <label htmlFor="baseUrl" className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    Base URL
                  </label>
                  <input
                    type="text"
                    id="baseUrl"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full pl-4 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-sm outline-none placeholder:text-zinc-400 font-mono"
                  />
                </div>

                <div className="space-y-2 animate-fadeIn">
                  <label htmlFor="model" className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    Model Name
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gpt-4o"
                    className="w-full pl-4 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-sm outline-none placeholder:text-zinc-400 font-mono"
                  />
                </div>
              </>
            )}
          </div>

        </div>

        <div className="px-6 py-4 bg-zinc-50 flex justify-end gap-3 border-t border-zinc-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-200/50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-black transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};