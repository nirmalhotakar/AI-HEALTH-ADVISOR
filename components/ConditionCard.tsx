import React, { useState } from 'react';
import { AlertTriangle, Pill, MapPin, ArrowRight, Home, ShieldAlert, Timer } from 'lucide-react';
import { Condition } from '../types';

interface ConditionCardProps {
  condition: Condition;
  onFindDoctors: (conditionName: string) => void;
  isLocating: boolean;
  isSelectedForMap: boolean;
}

const ConditionCard: React.FC<ConditionCardProps> = ({ condition, onFindDoctors, isLocating, isSelectedForMap }) => {
  const [activeTab, setActiveTab] = useState<'meds' | 'remedies' | 'precautions'>('meds');

  const getUrgencyStyles = (urgency: string) => {
    if (urgency.toLowerCase().includes('high')) return 'bg-red-50 text-red-700 border-red-100';
    if (urgency.toLowerCase().includes('medium')) return 'bg-orange-50 text-orange-700 border-orange-100';
    return 'bg-green-50 text-green-700 border-green-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex flex-wrap gap-2 justify-between items-start mb-4">
             <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyStyles(condition.urgency)} uppercase tracking-wide`}>
              {condition.urgency}
            </span>
             <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <span className="text-xs font-semibold text-slate-500">Confidence</span>
                <span className="text-xs font-bold text-blue-600">{condition.probability}</span>
            </div>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {condition.name}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 flex-grow flex flex-col">
        <p className="text-slate-600 mb-6 text-sm leading-relaxed border-b border-slate-50 pb-4">
            {condition.description}
        </p>

        {/* Action Tabs */}
        <div className="flex p-1 bg-slate-100/80 rounded-xl mb-4 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('meds')}
                className={`flex-1 flex items-center justify-center py-2 px-2 text-xs font-bold rounded-lg transition-all min-w-[70px] ${activeTab === 'meds' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Pill className="w-3 h-3 mr-1.5" /> Meds
            </button>
            <button 
                onClick={() => setActiveTab('remedies')}
                className={`flex-1 flex items-center justify-center py-2 px-2 text-xs font-bold rounded-lg transition-all min-w-[85px] ${activeTab === 'remedies' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Home className="w-3 h-3 mr-1.5" /> Remedies
            </button>
            <button 
                onClick={() => setActiveTab('precautions')}
                className={`flex-1 flex items-center justify-center py-2 px-2 text-xs font-bold rounded-lg transition-all min-w-[90px] ${activeTab === 'precautions' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <ShieldAlert className="w-3 h-3 mr-1.5" /> Precautions
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow space-y-4 mb-4">
            {activeTab === 'meds' && (
                <div className="space-y-3 animate-fade-in">
                    {condition.recommended_medications.map((med, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                            </div>
                            <p className="text-slate-500 text-xs mb-2">{med.dosage_guide}</p>
                            {med.warnings && (
                                <div className="flex items-start text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                                    <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                                    <span className="font-medium leading-snug">{med.warnings}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'remedies' && (
                <div className="space-y-3 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Home Remedies</h4>
                        <ul className="space-y-2">
                            {condition.recommended_activities.map((activity, idx) => (
                                <li key={idx} className="flex items-start text-sm text-emerald-900">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'precautions' && (
                <div className="space-y-3 animate-fade-in">
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">Precautions to Take</h4>
                        <ul className="space-y-2">
                            {condition.precautions.map((precaution, idx) => (
                                <li key={idx} className="flex items-start text-sm text-orange-900">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                                    {precaution}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>

        {/* Recovery Time Footer - Always Visible */}
        {condition.recovery_time && (
             <div className="mt-auto mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center">
                <Timer className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                    <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Estimated Recovery</p>
                    <p className="text-sm font-bold text-slate-800">{condition.recovery_time}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">If remedies & precautions are followed</p>
                </div>
             </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
        <button 
            onClick={() => onFindDoctors(condition.name)}
            disabled={isLocating}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm transition-all ${
                isSelectedForMap 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
            }`}
        >
            {isLocating && isSelectedForMap ? (
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
                <MapPin className="w-4 h-4" />
            )}
            <span>{isSelectedForMap ? 'Locating...' : 'Find Specialists'}</span>
            {!isSelectedForMap && <ArrowRight className="w-4 h-4 ml-1 opacity-50" />}
        </button>
      </div>
    </div>
  );
};

export default ConditionCard;