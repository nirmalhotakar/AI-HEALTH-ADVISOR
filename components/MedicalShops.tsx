import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, Clock } from 'lucide-react';
import { findPharmacies, DoctorSearchResult } from '../services/geminiService';

interface MedicalShopsProps {
    userLocation: { lat: number; lng: number } | null;
}

const MedicalShops: React.FC<MedicalShopsProps> = ({ userLocation }) => {
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
            const res = await findPharmacies(userLocation.lat, userLocation.lng);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!userLocation) {
        return <div className="p-8 text-center text-slate-500">Enable location to find medical shops.</div>;
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <p className="text-slate-600">Locating nearest pharmacies...</p>
            </div>
        );
    }

    const mapChunks = result?.chunks.filter(c => c.maps) || [];

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Nearest Medical Shops & Pharmacies</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <p className="text-slate-600 text-sm mb-4">{result?.text}</p>
                
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
                                    className="block group bg-slate-50 hover:bg-white border border-slate-200 hover:border-green-400 rounded-xl p-4 transition-all hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1">{chunk.maps.title}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-2">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>Check open hours in Maps</span>
                                    </div>
                                    <div className="mt-3 text-xs font-semibold text-green-700 flex items-center">
                                        <Navigation className="w-3 h-3 mr-1" />
                                        Get Directions
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-8">No specific locations found.</div>
                )}
            </div>
        </div>
    );
};

export default MedicalShops;
