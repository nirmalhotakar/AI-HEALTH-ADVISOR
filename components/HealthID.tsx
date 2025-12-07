import React, { useState } from 'react';
import { UserProfile, MedicalReport } from '../types';
import { ShieldCheck, Download, Activity, FileText, Loader2, IdCard } from 'lucide-react';
import { jsPDF } from "jspdf";

interface HealthIDProps {
  user: UserProfile;
  reports: MedicalReport[];
}

const HealthID: React.FC<HealthIDProps> = ({ user, reports }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    
    // --- Page 1: Health ID Card ---
    
    // Header Background
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("HealthPredictor Plus", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Medical Record", 20, 28);
    
    // Patient Profile Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Profile", 20, 60);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.name}`, 20, 75);
    doc.text(`Age: ${user.age || 'N/A'}`, 20, 85);
    doc.text(`Blood Type: ${user.bloodType || 'N/A'}`, 100, 85);
    doc.text(`Height: ${user.height || 'N/A'}`, 20, 95);
    doc.text(`Weight: ${user.weight || 'N/A'}`, 100, 95);
    
    // Emergency Section
    doc.setDrawColor(220, 38, 38); // Red border
    doc.setLineWidth(1);
    doc.rect(20, 110, 170, 35);
    
    doc.setTextColor(185, 28, 28); // Red text
    doc.setFont("helvetica", "bold");
    doc.text("EMERGENCY CONTACT", 25, 120);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.emergencyContactName || 'N/A'}`, 25, 130);
    doc.text(`Phone: ${user.emergencyContactPhone || 'N/A'}`, 100, 130);
    
    // --- Subsequent Pages: Reports ---
    if (reports.length > 0) {
        for (const report of reports) {
            doc.addPage();
            
            // Report Header
            doc.setFillColor(241, 245, 249); // Slate 100
            doc.rect(0, 0, 210, 20, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Report: ${report.title}`, 20, 13);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Date: ${report.date}`, 150, 13);
            
            if (report.type === 'Image') {
                try {
                    // Calculate aspect ratio to fit page
                    // A4 size: 210mm x 297mm
                    const imgProps = doc.getImageProperties(report.dataUrl);
                    const pdfWidth = 190; // 10mm margin
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    doc.addImage(report.dataUrl, 'JPEG', 10, 30, pdfWidth, pdfHeight);
                } catch (e) {
                    doc.text("Error rendering image.", 20, 40);
                }
            } else {
                // PDF Placeholder
                doc.setFontSize(12);
                doc.text("This report is a PDF document.", 20, 50);
                doc.text("Due to format limitations, it cannot be previewed in this summary.", 20, 60);
                
                doc.setDrawColor(200, 200, 200);
                doc.rect(50, 90, 110, 60);
                doc.text("PDF FILE ATTACHMENT", 105, 120, { align: 'center' });
            }
        }
    } else {
        doc.setFontSize(12);
        doc.setTextColor(150, 150, 150);
        doc.text("No medical reports attached.", 105, 240, { align: 'center' });
    }

    doc.save(`HealthRecord_${user.name.replace(/\s+/g, '_')}.pdf`);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="bg-slate-900 p-2.5 rounded-xl mr-4 shadow-lg shadow-slate-500/20">
             <IdCard className="w-6 h-6 text-white" />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Medical Record</h2>
            <p className="text-slate-500">Generate a complete PDF of your profile and report images.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ID Card Visual */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
             {/* Background Patterns */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-2">
                         <Activity className="w-6 h-6 text-blue-200" />
                         <span className="font-bold text-lg tracking-wide">HealthPlus</span>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>

                <div>
                    <h3 className="text-3xl font-bold mb-1">{user.name}</h3>
                    <p className="text-blue-100 text-sm opacity-80 mb-6">Patient ID: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4">
                             <div className="bg-white/10 p-2 rounded-lg flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-blue-200">Blood</p>
                                <p className="font-bold">{user.bloodType || '-'}</p>
                             </div>
                             <div className="bg-white/10 p-2 rounded-lg flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-blue-200">Age</p>
                                <p className="font-bold">{user.age || '-'}</p>
                             </div>
                        </div>

                         <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-red-200 mb-1">Emergency Contact</p>
                            <p className="font-bold text-sm">{user.emergencyContactName || 'Not set'}</p>
                            <p className="text-xs text-blue-100">{user.emergencyContactPhone}</p>
                         </div>
                    </div>
                </div>
             </div>

             <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-blue-200 mb-1">Attached Reports</p>
                    <p className="font-bold text-xl">{reports.length}</p>
                  </div>
             </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Digital Medical Record</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
                Download a secure PDF containing your health profile, emergency contacts, and copies of your report images.
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 shadow-inner mb-6 flex flex-col items-center">
               <FileText className="w-12 h-12 text-blue-500 mb-2" />
               <span className="text-sm font-semibold text-slate-700">PDF Format</span>
               <span className="text-xs text-slate-400">Includes {reports.length} report pages</span>
            </div>

            <button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center space-x-2 text-white font-bold bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
                {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>{isGenerating ? 'Generating PDF...' : 'Download Medical Record (PDF)'}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default HealthID;