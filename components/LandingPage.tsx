import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, ArrowRight, Brain, MapPin, AlertOctagon } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onEmergencyTrigger: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onEmergencyTrigger }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">HealthPredictor<span className="text-blue-600">Plus</span></span>
                </div>
                
                {/* Desktop Nav */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={onEmergencyTrigger}
                        className="flex items-center px-5 py-2.5 bg-red-50 text-red-600 rounded-full font-bold text-sm hover:bg-red-100 transition-all border border-red-200 shadow-sm hover:shadow-md active:scale-95 animate-pulse"
                    >
                        <AlertOctagon className="w-4 h-4 mr-2" />
                        SOS Emergency
                    </button>
                    <button 
                        onClick={onGetStarted}
                        className="px-6 py-2.5 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
                    >
                    Login
                    </button>
                    <button 
                        onClick={onGetStarted}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden pt-20 pb-28">
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100 shadow-sm">
                    <Brain className="w-4 h-4 mr-2" />
                    AI-Powered Healthcare Revolution
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                    Your Personal AI <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Health Companion</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Instantly analyze symptoms, find top-rated specialists, and manage your health records on your desktop.
                </p>
                
                <div className="flex flex-row justify-center items-center gap-5">
                    <button 
                        onClick={onGetStarted}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/30 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-1"
                    >
                        Check My Symptoms
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={onEmergencyTrigger}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-red-600 transition-all duration-200 bg-white border-2 border-red-100 rounded-full hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <AlertOctagon className="w-5 h-5 mr-2 animate-pulse" />
                        Emergency SOS
                    </button>
                </div>
            </div>
        </div>

        {/* Feature Grid */}
        <div className="bg-white py-20 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-3 gap-10">
                    <div className="group bg-slate-50 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 hover:border-slate-200">
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                            <Stethoscope className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Symptom Analysis</h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                            Our advanced ML models interpret natural language to predict potential conditions with high accuracy, guiding you to the right care.
                        </p>
                    </div>
                    
                    <div className="group bg-slate-50 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 hover:border-slate-200">
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                            <HeartPulse className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Care Plans</h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                            Receive tailored medication recommendations and lifestyle advice based on your unique health profile and clinical guidelines.
                        </p>
                    </div>
                    
                    <div className="group bg-slate-50 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 hover:border-slate-200">
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                            <MapPin className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Doctor Locator</h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                            Find the nearest specialists, clinics, and hospitals instantly with our integrated map-based locator and booking assistance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">HealthPredictor<span className="text-blue-500">Plus</span></span>
            </div>
            
            <div className="flex items-center space-x-2 mb-6 text-sm bg-slate-800 px-4 py-2 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
                <span>Secure • HIPAA Compliant • Private</span>
            </div>
            
            <p className="text-slate-500 text-sm text-center">&copy; 2024 HealthPredictor Plus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;