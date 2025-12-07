import React from 'react';
import { Activity, Stethoscope, LogOut, User } from 'lucide-react';

interface HeaderProps {
  user?: { name: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">HealthPredictor<span className="text-blue-600">Plus</span></h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="hidden md:flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Stethoscope className="w-4 h-4 mr-2" /> AI-Powered Analysis
            </span>
            
            {user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <div className="bg-slate-200 p-1.5 rounded-full">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;