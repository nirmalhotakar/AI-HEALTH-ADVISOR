import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Save, Cloud, Check, User, Info, Activity } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [saved, setSaved] = useState(false);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'backing_up' | 'done'>('idle');

  // Initialize units from profile or defaults
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(user.heightUnit || 'ft');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user.weightUnit || 'kg');

  // Helper to sync unit changes to formData immediately (so they save on submit)
  useEffect(() => {
    setFormData(prev => ({ ...prev, heightUnit, weightUnit }));
  }, [heightUnit, weightUnit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFeetInchesChange = (type: 'ft' | 'in', value: string) => {
    const currentHeight = formData.height || "0'0";
    let [ft, inch] = currentHeight.includes("'") ? currentHeight.split("'") : ['0', '0'];
    
    if (type === 'ft') ft = value;
    if (type === 'in') inch = value;

    setFormData({ ...formData, height: `${ft}'${inch}` });
  };

  const convertHeight = (toUnit: 'cm' | 'ft') => {
    const currentVal = formData.height;
    if (!currentVal) return;

    let newVal = '';
    
    if (toUnit === 'cm') {
        if (heightUnit === 'ft') {
            const [ft, inch] = currentVal.includes("'") ? currentVal.split("'") : [currentVal, '0'];
            const totalInches = (parseInt(ft || '0') * 12) + parseInt(inch || '0');
            newVal = Math.round(totalInches * 2.54).toString();
        } else {
             newVal = currentVal;
        }
    } else {
        if (heightUnit === 'cm') {
            const totalInches = parseInt(currentVal) / 2.54;
            const ft = Math.floor(totalInches / 12);
            const inch = Math.round(totalInches % 12);
            newVal = `${ft}'${inch}`;
        } else {
            newVal = currentVal;
        }
    }

    setFormData(prev => ({ ...prev, height: newVal }));
    setHeightUnit(toUnit);
  };

  const convertWeight = (toUnit: 'kg' | 'lbs') => {
    const currentVal = parseFloat(formData.weight || '0');
    if (!currentVal) {
        setWeightUnit(toUnit);
        return;
    }

    let newVal = '';
    if (toUnit === 'kg' && weightUnit === 'lbs') {
        newVal = Math.round(currentVal * 0.453592).toString();
    } else if (toUnit === 'lbs' && weightUnit === 'kg') {
        newVal = Math.round(currentVal * 2.20462).toString();
    } else {
        newVal = formData.weight || '';
    }

    setFormData(prev => ({ ...prev, weight: newVal }));
    setWeightUnit(toUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackup = () => {
    setBackupStatus('backing_up');
    setTimeout(() => {
        setBackupStatus('done');
        setTimeout(() => setBackupStatus('idle'), 3000);
    }, 2000);
  };

  const getDisplayFeet = () => formData.height?.split("'")[0] || '';
  const getDisplayInches = () => formData.height?.split("'")[1] || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Health Profile</h2>
            <p className="text-slate-500 mt-1">Manage your personal information and health metrics.</p>
          </div>
          <button 
            onClick={handleBackup}
            disabled={backupStatus !== 'idle'}
            className="flex items-center justify-center space-x-2 text-sm bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            {backupStatus === 'done' ? <Check className="w-4 h-4 text-green-500"/> : <Cloud className="w-4 h-4 text-blue-500"/>}
            <span>{backupStatus === 'idle' ? 'Backup Data' : backupStatus === 'backing_up' ? 'Backing up...' : 'Backup Complete'}</span>
          </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        
        {/* Section: Personal Details */}
        <div className="p-8 border-b border-slate-100">
            <div className="flex items-center space-x-2 mb-6 text-slate-800">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white transition-colors" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} disabled className="w-full rounded-xl border-slate-200 bg-slate-100 text-slate-500 shadow-sm py-2.5 px-4 cursor-not-allowed" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                        <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Type</label>
                        <select name="bloodType" value={formData.bloodType || ''} onChange={handleChange} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white">
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current City</label>
                    <input type="text" name="city" value={formData.city || ''} onChange={handleChange} placeholder="e.g., New York" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white" />
                </div>
            </div>
        </div>

        {/* Section: Body Metrics */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <div className="flex items-center space-x-2 mb-6 text-slate-800">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold">Body Metrics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Height */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-slate-700">Height</label>
                        <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
                            <button 
                                type="button"
                                onClick={() => convertHeight('ft')}
                                className={`px-3 py-1 rounded-md transition-all font-medium ${heightUnit === 'ft' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                FT
                            </button>
                            <button 
                                type="button"
                                onClick={() => convertHeight('cm')}
                                className={`px-3 py-1 rounded-md transition-all font-medium ${heightUnit === 'cm' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                CM
                            </button>
                        </div>
                    </div>
                    {heightUnit === 'cm' ? (
                        <div className="relative">
                            <input 
                                type="number" 
                                name="height" 
                                value={formData.height || ''} 
                                onChange={handleChange} 
                                placeholder="175"
                                className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 pr-12" 
                            />
                            <span className="absolute right-4 top-2.5 text-slate-400 font-medium">cm</span>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <input 
                                    type="number" 
                                    value={getDisplayFeet()}
                                    onChange={(e) => handleFeetInchesChange('ft', e.target.value)} 
                                    placeholder="5"
                                    className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 pr-8" 
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 font-medium">ft</span>
                            </div>
                            <div className="relative w-full">
                                <input 
                                    type="number" 
                                    value={getDisplayInches()}
                                    onChange={(e) => handleFeetInchesChange('in', e.target.value)} 
                                    placeholder="10"
                                    className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 pr-8" 
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 font-medium">in</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Weight */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-slate-700">Weight</label>
                        <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
                            <button 
                                type="button"
                                onClick={() => convertWeight('kg')}
                                className={`px-3 py-1 rounded-md transition-all font-medium ${weightUnit === 'kg' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                KG
                            </button>
                            <button 
                                type="button"
                                onClick={() => convertWeight('lbs')}
                                className={`px-3 py-1 rounded-md transition-all font-medium ${weightUnit === 'lbs' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                LBS
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input 
                            type="number" 
                            name="weight" 
                            value={formData.weight || ''} 
                            onChange={handleChange} 
                            placeholder={weightUnit === 'kg' ? "70" : "154"}
                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 pr-12" 
                        />
                            <span className="absolute right-4 top-2.5 text-slate-400 font-medium uppercase">{weightUnit}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Section: Medical Conditions & Emergency */}
        <div className="p-8">
            <div className="flex items-center space-x-2 mb-6 text-slate-800">
                <Info className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold">Medical History & Emergency</h3>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="block text-sm font-semibold text-slate-700 mb-3">Chronic Conditions</span>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" name="hasDiabetes" checked={formData.hasDiabetes || false} onChange={handleChange} className="peer h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Diabetes</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" name="hasHighBP" checked={formData.hasHighBP || false} onChange={handleChange} className="peer h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Hypertension (High BP)</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Contact Name</label>
                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Contact Phone</label>
                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 bg-slate-50 focus:bg-white" />
                    </div>
                </div>
            </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 font-bold"
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;