import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GroundingChunk, ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    conditions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the disease or condition." },
          probability: { type: Type.STRING, description: "Estimated probability percentage or level (e.g., '85%', 'High')." },
          description: { type: Type.STRING, description: "Brief explanation of the condition in simple terms." },
          urgency: { type: Type.STRING, description: "Urgency level: 'Low', 'Medium', or 'High - Seek immediate care'." },
          recommended_medications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Generic name of the medication." },
                dosage_guide: { type: Type.STRING, description: "General dosage guideline (consult doctor disclaimer)." },
                warnings: { type: Type.STRING, description: "Key side effects or contraindications." },
              },
              required: ["name", "dosage_guide", "warnings"]
            },
          },
          recommended_activities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of effective home remedies and lifestyle changes to alleviate symptoms."
          },
          precautions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of things to avoid (foods, behaviors, etc)."
          },
          recovery_time: {
            type: Type.STRING,
            description: "Estimated recovery time if advice is followed (e.g., '3-5 days')."
          }
        },
        required: ["name", "probability", "description", "urgency", "recommended_medications", "recommended_activities", "precautions", "recovery_time"],
      },
    },
  },
  required: ["conditions"],
};

export const analyzeSymptoms = async (symptoms: string, severity: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following patient symptoms described in natural language: "${symptoms}".
      The patient explicitly states the severity level as: "${severity}".
      
      Provide a list of the top 3 potential medical conditions.
      For each condition, provide:
      1. Probability and simple description.
      2. Urgency level.
      3. Standard generic medication recommendations.
      4. Effective home remedies and recommended activities to reduce symptoms.
      5. Precautions (what to avoid).
      6. Estimated recovery time in days if these steps are followed.
      
      Standardize medical terms.
      IMPORTANT: This is for a prototype health app. Always include a disclaimer in the output data if possible, or ensure the tone is suggestive, not diagnostic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
};

export interface DoctorSearchResult {
  text: string;
  chunks: GroundingChunk[];
}

export const findDoctors = async (condition: string, lat: number, lng: number): Promise<DoctorSearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find top-rated medical specialists or clinics for treating "${condition}" near the location with latitude ${lat} and longitude ${lng}. 
      List 3-5 options. Provide their names and a very brief reason why they are a good fit. 
      IMPORTANT: Explicitly mention the clinic hours or opening times for each option if available.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
            retrievalConfig: {
                latLng: {
                    latitude: lat,
                    longitude: lng
                }
            }
        }
      },
    });

    const text = response.text || "No specific doctor details found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, chunks: chunks as GroundingChunk[] };
  } catch (error) {
    console.error("Error finding doctors:", error);
    throw error;
  }
};

export const findPharmacies = async (lat: number, lng: number): Promise<DoctorSearchResult> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the nearest open pharmacies or medical shops near latitude ${lat} and longitude ${lng}. 
        List 3 options. Mention their opening hours and if they are 24/7.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
              retrievalConfig: {
                  latLng: {
                      latitude: lat,
                      longitude: lng
                  }
              }
          }
        },
      });
  
      const text = response.text || "No pharmacies found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
      return { text, chunks: chunks as GroundingChunk[] };
    } catch (error) {
      console.error("Error finding pharmacies:", error);
      throw error;
    }
  };

export const findHospitals = async (lat: number, lng: number): Promise<DoctorSearchResult> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the nearest hospitals and general clinics near latitude ${lat} and longitude ${lng}. 
        List 3-5 options. Mention their opening hours and emergency services availability.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
              retrievalConfig: {
                  latLng: {
                      latitude: lat,
                      longitude: lng
                  }
              }
          }
        },
      });
  
      const text = response.text || "No hospitals found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
      return { text, chunks: chunks as GroundingChunk[] };
    } catch (error) {
      console.error("Error finding hospitals:", error);
      throw error;
    }
  };

export const findEmergencyServices = async (lat: number, lng: number): Promise<DoctorSearchResult> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `URGENT: Find the nearest Ambulance Services, Emergency Rooms (ER), Trauma Centers, and Hospitals with 24/7 emergency care near latitude ${lat} and longitude ${lng}.
        List 3-5 options. Prioritize those with 24-hour service and ambulance availability. Provide their names, approximate distance if available, and emergency phone numbers if public.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
              retrievalConfig: {
                  latLng: {
                      latitude: lat,
                      longitude: lng
                  }
              }
          }
        },
      });

      const text = response.text || "No emergency services found immediately.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return { text, chunks: chunks as GroundingChunk[] };
    } catch (error) {
      console.error("Error finding emergency services:", error);
      throw error;
    }
};

export const analyzeInsuranceBill = async (billText: string, provider: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user has insurance with "${provider || 'General Provider'}". 
            Analyze the following medical bill text/treatment details:
            "${billText}"
            
            1. Summarize the treatments.
            2. Estimate what might be covered based on standard insurance policies (Disclaimer: estimation only).
            3. Highlight any potential out-of-pocket costs or non-standard billing items.`,
        });
        return response.text || "Could not analyze bill.";
    } catch (error) {
        console.error("Error analyzing insurance:", error);
        return "Error analyzing insurance bill.";
    }
};

export const getHealthChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: "You are a helpful, empathetic AI health assistant. Provide general health advice, explain medical terms, and suggest healthy habits. Do not provide definitive medical diagnoses. Always advise seeing a doctor for serious issues."
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (error) {
        console.error("Chat error:", error);
        return "I'm having trouble connecting right now. Please try again.";
    }
}