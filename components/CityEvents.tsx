import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface CityEventsProps {
    city: string;
}

const CityEvents: React.FC<CityEventsProps> = ({ city }) => {
  // Mock data simulation - in a real app this would call an API
  const defaultCity = city || "your area";
  
  const events = [
    { id: 1, title: 'Free Diabetes Screening Camp', date: 'Next Saturday', location: 'City General Hospital', desc: 'Comprehensive sugar checkup and dietary advice.' },
    { id: 2, title: 'Blood Donation Drive', date: 'Oct 25, 2024', location: 'Red Cross Center, Downtown', desc: 'Join us to save lives. Refreshments provided.' },
    { id: 3, title: 'Mental Health Awareness Workshop', date: 'Nov 02, 2024', location: 'Community Hall', desc: 'Expert talks on stress management and yoga session.' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-orange-100 p-2 rounded-lg mr-3">
             <Calendar className="w-6 h-6 text-orange-600" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Health Programs in {defaultCity}</h2>
            <p className="text-slate-500 text-sm">Stay updated with local health initiatives and camps.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-orange-500"></div>
                <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">{event.desc}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CityEvents;