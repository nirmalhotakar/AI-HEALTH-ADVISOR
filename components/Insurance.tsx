import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, FileSearch, CheckCircle } from 'lucide-react';
import { analyzeInsuranceBill } from '../services/geminiService';

interface InsuranceProps {
    user: UserProfile;
    onUpdate: (user: UserProfile) => void;
}

const Insurance: React.FC<InsuranceProps> = ({ user, onUpdate }) => {
    const [billText, setBillText] = useState('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(user); // Assumes parent handles the state update passed down via props reference (simplified for prototype)
        alert("Insurance details updated.");
    };

    const handleAnalyze = async () => {
        if (!billText.trim()) return;
        setAnalyzing(true);
        const result = await analyzeInsuranceBill(billText, user.insuranceProvider || '');
        setAnalysis(result);
        setAnalyzing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Insurance Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Provider Name</label>
                        <input 
                            type="text" 
                            value={user.insuranceProvider || ''}
                            onChange={(e) => onUpdate({...user, insuranceProvider: e.target.value})}
                            className="mt-1 block w-full rounded-md border-slate-300 border p-2 shadow-sm"
                            placeholder="e.g. BlueCross"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Policy Number</label>
                        <input 
                            type="text" 
                            value={user.insurancePolicyNumber || ''}
                            onChange={(e) => onUpdate({...user, insurancePolicyNumber: e.target.value})}
                            className="mt-1 block w-full rounded-md border-slate-300 border p-2 shadow-sm"
                            placeholder="XX-1234-5678"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <FileSearch className="w-5 h-5 mr-2 text-purple-600" />
                    Bill Analyzer
                </h2>
                <p className="text-slate-500 text-sm mb-4">Paste the text from a medical bill or treatment summary below. AI will help simplify it and estimate coverage based on standard policies.</p>
                
                <textarea
                    value={billText}
                    onChange={(e) => setBillText(e.target.value)}
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Paste bill items here..."
                />
                
                <div className="mt-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || !billText}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Bill'}
                    </button>
                </div>

                {analysis && (
                    <div className="mt-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <h3 className="font-semibold text-purple-900 mb-2">Analysis Result</h3>
                        <p className="text-sm text-purple-800 whitespace-pre-wrap leading-relaxed">{analysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insurance;
