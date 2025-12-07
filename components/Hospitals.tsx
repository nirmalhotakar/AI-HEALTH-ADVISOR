import React, { useState, useEffect } from 'react';
import { Building2, Navigation, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { findHospitals, DoctorSearchResult } from '../services/geminiService';

interface HospitalsProps {
    userLocation: { lat: number; lng: number } | null;
}

const Hospitals: React.FC<HospitalsProps> = ({ userLocation }) => {
    const [result, setResult] = useState<DoctorSearchResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userLocation) {
            handleSearch();
        }
    }, [userLocation]);

    const handleSearch = async () => {
        if (!userLocation) return;
        setLoading(true);
        try {
            const res = await findHospitals(userLocation.lat, userLocation.lng);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!userLocation) {
        return <div className="p-8 text-center text-slate-500">Enable location to find nearby clinics and hospitals.</div>;
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                 <p className="text-slate-600">Locating nearest healthcare facilities...</p>
            </div>
        );
    }

    const mapChunks = result?.chunks.filter(c => c.maps) || [];

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Building2 className="w-7 h-7 mr-2 text-red-500" />
                Nearby Clinics & Hospitals
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{result?.text}</p>
                
                {mapChunks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mapChunks.map((chunk, idx) => {
                            if (!chunk.maps) return null;
                            return (
                                <a 
                                    key={idx}
                                    href={chunk.maps.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-400 rounded-xl p-4 transition-all hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1">{chunk.maps.title}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-2 mb-2">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>Check hours in Maps</span>
                                    </div>
                                    <div className="flex items-center text-xs font-semibold text-red-600">
                                        <Navigation className="w-3 h-3 mr-1" />
                                        Get Directions
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p>No specific locations returned from the map service. <br/>Please verify your location permissions or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hospitals;