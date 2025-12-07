
export interface Medication {
  name: string;
  dosage_guide: string;
  warnings: string;
}

export interface Condition {
  name: string;
  probability: string;
  description: string;
  urgency: string;
  recommended_medications: Medication[];
  recommended_activities: string[];
  precautions: string[];
  recovery_time: string;
}

export interface AnalysisResult {
  conditions: Condition[];
}

export interface DoctorLocation {
  name: string;
  address?: string;
  uri?: string; // Google Maps URI
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            snippet?: string;
        }[]
    }
  };
}

export interface UserProfile {
  name: string;
  email: string;
  age?: string;
  height?: string;
  heightUnit?: 'cm' | 'ft';
  weight?: string;
  weightUnit?: 'kg' | 'lbs';
  bloodType?: string;
  hasDiabetes?: boolean;
  hasHighBP?: boolean;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  type: 'PDF' | 'Image';
  mimeType: string;
  dataUrl: string; // Base64 data for preview
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}