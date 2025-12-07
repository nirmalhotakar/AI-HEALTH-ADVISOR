import React from 'react';
import { AlertCircle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-xs text-amber-800">
            <strong className="font-semibold">Medical Disclaimer:</strong> This application is a prototype for educational and demonstration purposes only. 
            The AI-generated results are not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
            If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
