import React from 'react';
import { 
  Home, User, FileText, MessageSquare, 
  MapPin, Shield, Calendar, LogOut, Heart, Building2, AlertOctagon, IdCard
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'app', label: 'Analysis', icon: Home },
    { id: 'emergencies', label: 'Emergencies', icon: AlertOctagon, special: true },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'qrcode', label: 'Health Card', icon: IdCard },
    { id: 'hospitals', label: 'Clinics/Hospitals', icon: Building2 },
    { id: 'shops', label: 'Pharmacies', icon: MapPin },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'chat', label: 'AI HealthChat', icon: MessageSquare },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'events', label: 'City Health', icon: Calendar },
  ];

  return (
    <div className="w-72 bg-white border-r border-slate-200 text-slate-800 flex-shrink-0 h-screen overflow-y-auto font-sans sticky top-0 z-40">
      <div className="flex flex-col h-full min-h-screen">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Heart className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">HealthPlus</span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${currentView === item.id 
                    ? (item.special ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30') 
                    : (item.special ? 'text-red-500 hover:bg-red-50' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600')}
                `}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.id ? (item.special ? 'text-red-600' : 'text-white') : (item.special ? 'text-red-500' : 'text-slate-400 group-hover:text-blue-600')}`} />
                <span className={`font-medium ${item.special && 'font-bold'}`}>{item.label}</span>
                {currentView === item.id && !item.special && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;