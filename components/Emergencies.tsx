import React, { useState, useEffect } from 'react';
import { AlertOctagon, MapPin, Share2, Navigation, Phone, ExternalLink, Loader2, Ambulance, UserCheck, CheckCircle2, X } from 'lucide-react';
import { findEmergencyServices, DoctorSearchResult } from '../services/geminiService';
import { UserProfile } from '../types';

interface EmergenciesProps {
    userLocation: { lat: number; lng: number } | null;
    user?: UserProfile | null;
    isOverlay?: boolean;
    onClose?: () => void;
    autoRunSOS?: boolean;
}

const Emergencies: React.FC<EmergenciesProps> = ({ userLocation, user, isOverlay, onClose, autoRunSOS }) => {
    const [result, setResult] = useState<DoctorSearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    
    // SOS State
    const [sosActive, setSosActive] = useState(false);
    const [sosStep, setSosStep] = useState(0); // 0: Idle, 1: Locating, 2: Dispatching Ambulance, 3: Notifying Family, 4: Done
    const [nearestHospital, setNearestHospital] = useState<string | null>(null);

    useEffect(() => {
        if (userLocation) {
            fetchEmergencyServices();
        }
    }, [userLocation]);

    useEffect(() => {
        if (autoRunSOS && userLocation) {
            handleSOS();
        }
    }, [autoRunSOS, userLocation]);

    const fetchEmergencyServices = async () => {
        if (!userLocation) return;
        setLoading(true);
        try {
            const res = await findEmergencyServices(userLocation.lat, userLocation.lng);
            setResult(res);
            
            // Try to find the first map result to set as "Nearest" for simulation
            const firstHospital = res.chunks.find(c => c.maps)?.maps?.title;
            if (firstHospital) setNearestHospital(firstHospital);
        } catch (e) {
            console.error("Failed to fetch emergency services", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSOS = () => {
        if (!userLocation) {
            // Wait for location to be passed
            return;
        }
        setSosActive(true);
        setSosStep(1);

        // Simulation Sequence
        setTimeout(() => {
            // Step 2: Contacting Ambulance
            setSosStep(2);
            setTimeout(() => {
                // Step 3: Contacting Family
                setSosStep(3);
                setTimeout(() => {
                    // Step 4: Done
                    setSosStep(4);
                }, 2500);
            }, 2500);
        }, 1500);
    };

    const handleShareLocation = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Location',
                text: 'I am here:',
                url: `https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`
            }).catch(console.error);
        } else {
             const msg = `https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`;
             navigator.clipboard.writeText(msg);
             alert("Location URL copied to clipboard.");
        }
    };

    const mapChunks = result?.chunks.filter(c => c.maps) || [];

    const content = (
        <div className={`space-y-8 animate-fade-in-up relative ${isOverlay ? 'w-full' : 'max-w-5xl mx-auto'}`}>
            
            {/* SOS Overlay Modal (Inner) */}
            {(sosActive) && (
                <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col relative">
                        {/* Close Button for Overlay */}
                         <button 
                            onClick={() => { setSosActive(false); if(onClose) onClose(); }}
                            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="bg-red-600 p-8 text-white text-center">
                            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <AlertOctagon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-wider mb-2">Emergency SOS</h2>
                            <p className="text-red-100 font-medium">Do not panic. Help is being coordinated.</p>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* Step 1: Location */}
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sosStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {sosStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${sosStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Locating Patient</p>
                                    <p className="text-xs text-slate-500">
                                        {sosStep >= 1 && userLocation 
                                            ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
                                            : 'Waiting for GPS...'}
                                    </p>
                                </div>
                                {sosStep === 1 && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            </div>

                            {/* Step 2: Ambulance */}
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sosStep >= 2 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                     {sosStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : <Ambulance className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${sosStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Dispatching Ambulance</p>
                                    <p className="text-xs text-slate-500">
                                        {sosStep >= 2 
                                            ? `Nearest: ${nearestHospital || 'General Hospital'}` 
                                            : 'Finding nearest unit...'}
                                    </p>
                                </div>
                                {sosStep === 2 && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            </div>

                            {/* Step 3: Family */}
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sosStep >= 3 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {sosStep > 3 ? <CheckCircle2 className="w-5 h-5" /> : <UserCheck className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${sosStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Notifying Family</p>
                                    <p className="text-xs text-slate-500">
                                        {sosStep >= 3 
                                            ? `Alert sent to ${user?.emergencyContactName || 'Emergency Contact'}` 
                                            : 'Sending SMS alert...'}
                                    </p>
                                </div>
                                {sosStep === 3 && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            </div>

                            {sosStep === 4 && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center text-sm font-bold border border-green-100 mt-4">
                                    Response Coordinated. Stay where you are.
                                </div>
                            )}

                             {sosStep === 4 && (
                                <button 
                                    onClick={() => { setSosActive(false); if(onClose) onClose(); }}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Close Overlay
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Header (Visible if not overlay or underneath overlay) */}
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-2xl animate-pulse">
                        <AlertOctagon className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Emergency Center</h2>
                        <p className="text-slate-600">Immediate assistance and hospital locator.</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={handleShareLocation}
                        className="flex items-center px-6 py-3 bg-white border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold rounded-xl transition-all shadow-sm"
                    >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Location
                    </button>
                    <button 
                        onClick={handleSOS}
                        className="flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        <AlertOctagon className="w-5 h-5 mr-2" />
                        TRIGGER SOS
                    </button>
                </div>
            </div>
            
            {/* Quick Action: Call Ambulance */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Call Ambulance</h3>
                        <p className="text-sm text-slate-500">Connect to nearest dispatch</p>
                    </div>
                    <button className="p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Phone className="w-6 h-6" />
                    </button>
                </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-green-300 transition-colors flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Your Location</h3>
                        <p className="text-sm text-slate-500 font-mono">
                            {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Locating...'}
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                        <MapPin className="w-6 h-6" />
                    </div>
                </div>
             </div>

            {/* Results Grid */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <Ambulance className="w-6 h-6 mr-2 text-red-500" />
                    Nearest Hospitals & Trauma Centers
                </h3>

                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500">Scanning for emergency services...</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mapChunks.length > 0 ? mapChunks.map((chunk, idx) => {
                             if (!chunk.maps) return null;
                             return (
                                <a 
                                    key={idx}
                                    href={chunk.maps.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-red-200 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-red-50 text-red-600 p-2.5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <AlertOctagon className="w-6 h-6" />
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-red-500" />
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{chunk.maps.title}</h4>
                                    <div className="flex items-center text-sm font-bold text-red-600 mt-4">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Navigate Now
                                    </div>
                                </a>
                             );
                        }) : (
                             <div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500">No data found. Use standard emergency number (911/112).</p>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    if (isOverlay) {
        // If it's an overlay (from App.tsx global trigger), we wrap it in a modal container
        return (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                     <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="overflow-y-auto p-8 h-full">
                        {content}
                    </div>
                 </div>
            </div>
        );
    }

    return content;
};

export default Emergencies;