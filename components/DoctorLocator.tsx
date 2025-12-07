import React from 'react';
import { MapPin, Star, ExternalLink, Navigation, Stethoscope } from 'lucide-react';
import { GroundingChunk } from '../types';

interface DoctorLocatorProps {
  condition: string;
  result: {
    text: string;
    chunks: GroundingChunk[];
  } | null;
  loading: boolean;
}

const DoctorLocator: React.FC<DoctorLocatorProps> = ({ condition, result, loading }) => {
  if (loading) {
    return (
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded-full w-1/3 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                     <div className="h-40 bg-slate-100 rounded-2xl"></div>
                     <div className="h-40 bg-slate-100 rounded-2xl"></div>
                     <div className="h-40 bg-slate-100 rounded-2xl"></div>
                </div>
            </div>
        </div>
    );
  }

  if (!result) return null;

  const mapChunks = result.chunks.filter(chunk => chunk.maps);

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden scroll-mt-24" id="doctor-results">
      <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Top Specialists for {condition}</h3>
        </div>
        <p className="text-blue-100 ml-11">We found these highly-rated specialists near your location.</p>
      </div>

      <div className="p-8">
        <div className="prose prose-slate max-w-none text-slate-600 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
           <p className="leading-relaxed">{result.text}</p>
        </div>

        {mapChunks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mapChunks.map((chunk, index) => {
                if (!chunk.maps) return null;
                const { title, uri } = chunk.maps;
                
                return (
                <a 
                    key={index} 
                    href={uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    
                    <h4 className="font-bold text-lg text-slate-900 mb-2 pr-4 leading-tight">{title}</h4>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">View details, reviews, and booking information on Google Maps.</p>
                    
                    <div className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 py-2 px-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors w-fit">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                    </div>
                </a>
                );
            })}
            </div>
        ) : (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <MapPin className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                <p className="font-medium">No specific map locations returned.</p>
                <p className="text-sm mt-1">Please check your location permissions or try a broader search.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DoctorLocator;