import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SymptomInput from './components/SymptomInput';
import ConditionCard from './components/ConditionCard';
import DoctorLocator from './components/DoctorLocator';
import Disclaimer from './components/Disclaimer';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Reports from './components/Reports';
import HealthChat from './components/HealthChat';
import MedicalShops from './components/MedicalShops';
import Hospitals from './components/Hospitals';
import Insurance from './components/Insurance';
import CityEvents from './components/CityEvents';
import Emergencies from './components/Emergencies';
import HealthID from './components/HealthID';

import { AnalysisResult, GroundingChunk, UserProfile, MedicalReport } from './types';
import { analyzeSymptoms, findDoctors } from './services/geminiService';

const App: React.FC = () => {
  // Navigation & User State
  // Initialize from LocalStorage to simulate database persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('healthPlus_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [view, setView] = useState<'landing' | 'auth' | 'app'>(() => {
    return localStorage.getItem('healthPlus_user') ? 'app' : 'landing';
  });
  
  const [currentAppView, setCurrentAppView] = useState('app'); // sub-views inside the logged-in app

  // Data State
  const [reports, setReports] = useState<MedicalReport[]>(() => {
    try {
      const saved = localStorage.getItem('healthPlus_reports');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // App Functional State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [doctorResult, setDoctorResult] = useState<{ text: string; chunks: GroundingChunk[] } | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Emergency State
  const [emergencyOverlay, setEmergencyOverlay] = useState(false);

  // Persistence Effects (Simulating Database Updates)
  useEffect(() => {
    if (user) {
        localStorage.setItem('healthPlus_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('healthPlus_user');
    }
  }, [user]);

  useEffect(() => {
    try {
        localStorage.setItem('healthPlus_reports', JSON.stringify(reports));
    } catch (e) {
        console.error("Local storage quota exceeded", e);
        // Optional: Alert user if storage is full
    }
  }, [reports]);

  useEffect(() => {
    // Attempt to get location on mount or when user updates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to retrieve location. Doctor search will be less accurate.");
          // Default: San Francisco
          if (!userLocation) setUserLocation({ lat: 37.7749, lng: -122.4194 }); 
        }
      );
    }
  }, [user]);

  const handleTriggerEmergency = () => {
      // Force location update if possible
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setEmergencyOverlay(true);
            },
            () => {
                setEmergencyOverlay(true); // Open anyway, likely with default or null location handling
            }
        );
      } else {
        setEmergencyOverlay(true);
      }
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    // If we have a saved user with this email (re-login), keep their extra details
    // Otherwise create new session
    if (user && user.email === userData.email) {
        setUser({ ...user, name: userData.name });
    } else {
        setUser({ 
            name: userData.name, 
            email: userData.email,
            age: '', height: '', weight: '', bloodType: '',
            hasDiabetes: false, hasHighBP: false, city: '',
            emergencyContactName: '', emergencyContactPhone: ''
        });
    }
    setView('app');
    setCurrentAppView('app');
  };

  const handleLogout = () => {
    // Directly logout without confirmation dialog to ensure it works reliably
    setUser(null);
    setAnalysisResult(null);
    setDoctorResult(null);
    setReports([]); 
    localStorage.removeItem('healthPlus_reports'); // Clear sensitive data on logout
    localStorage.removeItem('healthPlus_user');
    setView('landing');
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleAddReport = (report: MedicalReport) => {
    setReports(prev => [report, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleAnalyze = async (symptoms: string, severity: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDoctorResult(null);
    setSelectedCondition(null);

    try {
      const result = await analyzeSymptoms(symptoms, severity);
      setAnalysisResult(result);
    } catch (error) {
      alert("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFindDoctors = async (conditionName: string) => {
    if (!userLocation) {
      alert("Location services are required to find nearby doctors. Please enable location permissions.");
      return;
    }

    setIsLocating(true);
    setSelectedCondition(conditionName);
    setDoctorResult(null);

    try {
      const result = await findDoctors(conditionName, userLocation.lat, userLocation.lng);
      setDoctorResult(result);
      setTimeout(() => {
        const element = document.getElementById('doctor-results');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Failed to find doctors nearby.");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex font-sans text-slate-900 overflow-hidden">
      
      {/* Global Emergency Overlay */}
      {emergencyOverlay && (
          <Emergencies 
            isOverlay={true} 
            onClose={() => setEmergencyOverlay(false)} 
            userLocation={userLocation} 
            user={user}
            autoRunSOS={true}
          />
      )}

      {view === 'landing' && (
        <div className="w-full h-full overflow-y-auto">
             <LandingPage 
                onGetStarted={() => setView('auth')} 
                onEmergencyTrigger={handleTriggerEmergency}
            />
        </div>
      )}

      {view === 'auth' && (
        <div className="w-full h-full overflow-y-auto">
            <Auth 
                onLogin={handleLogin} 
                onBack={() => setView('landing')} 
                onEmergencyTrigger={handleTriggerEmergency}
            />
        </div>
      )}

      {view === 'app' && (
        <>
            {/* Desktop Sidebar (Fixed Width, Full Height) */}
            <div className="flex-shrink-0 h-full">
                <Sidebar 
                    currentView={currentAppView} 
                    onNavigate={(v) => { setCurrentAppView(v); }} 
                    onLogout={handleLogout}
                />
            </div>

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50">
                <Header user={user} onLogout={handleLogout} />
                
                <main className="flex-1 overflow-y-auto p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        {currentAppView === 'app' && (
                            <>
                                <div className="max-w-4xl mx-auto mb-10 text-center animate-fade-in-up">
                                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                                        Good Morning, {user?.name}
                                    </h1>
                                    <p className="text-lg text-slate-500">
                                        How can we help you feel better today?
                                    </p>
                                </div>

                                <div className="max-w-4xl mx-auto animate-fade-in-up">
                                    <SymptomInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
                                </div>

                                {analysisResult && (
                                <div className="animate-fade-in-up mt-12">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                                            <p className="text-slate-500 text-sm mt-1">Based on your reported symptoms</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                                    {analysisResult.conditions.map((condition, index) => (
                                        <ConditionCard 
                                            key={index} 
                                            condition={condition} 
                                            onFindDoctors={handleFindDoctors}
                                            isLocating={isLocating}
                                            isSelectedForMap={selectedCondition === condition.name}
                                        />
                                    ))}
                                    </div>

                                    <Disclaimer />
                                </div>
                                )}

                                {(isLocating || doctorResult) && selectedCondition && (
                                    <div className="max-w-6xl mx-auto animate-fade-in-up pb-12">
                                        <DoctorLocator 
                                            condition={selectedCondition} 
                                            result={doctorResult} 
                                            loading={isLocating} 
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {currentAppView === 'emergencies' && (
                            <div className="animate-fade-in-up">
                                <Emergencies userLocation={userLocation} user={user} />
                            </div>
                        )}

                        {currentAppView === 'profile' && user && (
                            <div className="animate-fade-in-up">
                                <Profile user={user} onUpdate={handleUpdateProfile} />
                            </div>
                        )}

                        {currentAppView === 'qrcode' && user && (
                            <div className="animate-fade-in-up">
                                <HealthID user={user} reports={reports} />
                            </div>
                        )}

                        {currentAppView === 'hospitals' && (
                            <div className="animate-fade-in-up">
                                <Hospitals userLocation={userLocation} />
                            </div>
                        )}

                        {currentAppView === 'reports' && (
                            <div className="animate-fade-in-up">
                                <Reports 
                                    reports={reports} 
                                    onAddReport={handleAddReport} 
                                    onDeleteReport={handleDeleteReport} 
                                />
                            </div>
                        )}

                        {currentAppView === 'chat' && (
                            <div className="animate-fade-in-up h-[calc(100vh-160px)]">
                                <HealthChat />
                            </div>
                        )}

                        {currentAppView === 'shops' && (
                            <div className="animate-fade-in-up">
                                <MedicalShops userLocation={userLocation} />
                            </div>
                        )}

                        {currentAppView === 'insurance' && user && (
                            <div className="animate-fade-in-up">
                                <Insurance user={user} onUpdate={handleUpdateProfile} />
                            </div>
                        )}

                        {currentAppView === 'events' && (
                            <div className="animate-fade-in-up">
                                <CityEvents city={user?.city || ''} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
      )}
    </div>
  );
};

export default App;