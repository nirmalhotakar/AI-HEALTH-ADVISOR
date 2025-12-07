import React, { useState } from 'react';
import { Search, Mic, Activity, Sparkles } from 'lucide-react';

interface SymptomInputProps {
  onAnalyze: (symptoms: string, severity: string) => void;
  isLoading: boolean;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ onAnalyze, isLoading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('Moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onAnalyze(symptoms, severity);
    }
  };

  const severityLevels = [
    { label: 'Mild', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200', active: 'ring-2 ring-green-500 bg-green-50' },
    { label: 'Moderate', color: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200', active: 'ring-2 ring-orange-500 bg-orange-50' },
    { label: 'Severe', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200', active: 'ring-2 ring-red-500 bg-red-50' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 mb-8 transition-all duration-300">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center">
            <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
            Symptom Check
        </h2>
        <p className="text-slate-500">Describe what you're feeling in detail for the most accurate AI analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative group">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., I've had a throbbing headache on the left side for 2 days, accompanied by nausea..."
            className="w-full h-40 p-5 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white resize-none outline-none transition-all placeholder-slate-400 text-lg leading-relaxed shadow-inner"
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="absolute right-4 bottom-4 p-2.5 text-slate-400 bg-white border border-slate-200 rounded-full hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
            title="Voice input (simulation)"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center uppercase tracking-wider">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                Severity Level
            </label>
            <div className="flex flex-wrap gap-4">
                {severityLevels.map((level) => (
                    <button
                        key={level.label}
                        type="button"
                        onClick={() => setSeverity(level.label)}
                        className={`
                            px-6 py-3 rounded-xl border text-sm font-bold transition-all duration-200 flex-1 md:flex-none text-center
                            ${severity === level.label 
                                ? `${level.active} shadow-md transform scale-105` 
                                : `bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300`
                            }
                        `}
                    >
                        {level.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!symptoms.trim() || isLoading}
            className={`
              flex items-center space-x-2 px-10 py-4 rounded-xl font-bold text-white transition-all text-lg
              ${!symptoms.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing Symptoms...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SymptomInput;