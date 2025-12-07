import React, { useState, useRef } from 'react';
import { FileText, Upload, Trash2, Eye, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { MedicalReport } from '../types';

interface ReportsProps {
  reports: MedicalReport[];
  onAddReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ reports, onAddReport, onDeleteReport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File is too large. Please upload files smaller than 5MB.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const type = file.type.includes('pdf') ? 'PDF' : 'Image';
      
      const newReport: MedicalReport = {
        id: Date.now().toString(),
        title: file.name,
        date: new Date().toLocaleDateString(),
        type: type,
        mimeType: file.type,
        dataUrl: dataUrl
      };

      onAddReport(newReport);
      setIsUploading(false);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = () => {
        alert("Failed to read file.");
        setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Medical Reports</h2>
            <p className="text-slate-500 text-sm">Upload and view your prescriptions, test results, and x-rays.</p>
        </div>
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf,image/*"
                onChange={handleFileChange}
            />
            <button 
                onClick={triggerUpload}
                disabled={isUploading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{isUploading ? 'Uploading...' : 'Upload Report'}</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {reports.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <div className="bg-slate-100 p-4 rounded-full mb-3">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No reports uploaded</h3>
                <p className="text-sm mt-1 max-w-xs">Upload PDF documents or images (JPG, PNG) to keep your medical history organized.</p>
            </div>
        ) : (
            <ul className="divide-y divide-slate-100">
                {reports.map((report) => (
                    <li key={report.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setSelectedReport(report)}>
                            <div className={`p-3 rounded-lg ${report.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {report.type === 'PDF' ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{report.title}</h4>
                                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-200 px-1.5 py-0.5 rounded">{report.type}</span>
                                    <span>•</span>
                                    <span>Uploaded on {report.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setSelectedReport(report)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Report"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => onDeleteReport(report.id)} 
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>

      {/* View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-fade-in-up overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${selectedReport.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {selectedReport.type === 'PDF' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{selectedReport.title}</h3>
                            <p className="text-xs text-slate-500">{selectedReport.date}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedReport(null)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 bg-slate-100 p-4 overflow-hidden flex items-center justify-center relative">
                    {selectedReport.type === 'Image' ? (
                         <img 
                            src={selectedReport.dataUrl} 
                            alt={selectedReport.title} 
                            className="max-w-full max-h-full object-contain rounded shadow-lg"
                        />
                    ) : (
                        <iframe 
                            src={selectedReport.dataUrl} 
                            className="w-full h-full rounded shadow-lg bg-white"
                            title={selectedReport.title}
                        />
                    )}
                </div>

                <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-400">
                    {selectedReport.type === 'PDF' ? 'Use the PDF toolbar to zoom or print.' : 'Right click image to save.'}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;