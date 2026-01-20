import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from "../types";

export const analyzeScores = async (scores: number[]): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Returning mock analysis.");
    return {
      prediction: "缺少 API 密钥",
      sentiment: "neutral",
      analysisText: "请配置您的 API 密钥以获取实时 AI 录用预测。"
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

  // Updated prompt to request Chinese response
  const prompt = `
    You are a senior area chair for CVPR (Computer Vision and Pattern Recognition Conference).
    A paper has received the following review scores (scale 1-6, where 1=Strong Reject, 6=Strong Accept): [${scores.join(', ')}].
    The average score is ${average}.
    
    Please provide a brief assessment of the acceptance likelihood and a short encouraging or realistic comment.
    
    IMPORTANT: Return the response in JSON format. The content of 'prediction' and 'analysisText' MUST BE IN SIMPLIFIED CHINESE.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: {
              type: Type.STRING,
              description: "Short phrase prediction in Chinese like '很有希望 (Likely Accept)', '处于边缘 (Borderline)', '希望不大 (Likely Reject)'.",
            },
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "neutral", "negative"],
              description: "The overall sentiment of the situation.",
            },
            analysisText: {
              type: Type.STRING,
              description: "2-3 sentences analyzing the scores in Simplified Chinese.",
            },
          },
          required: ["prediction", "sentiment", "analysisText"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiAnalysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      prediction: "分析暂时不可用",
      sentiment: "neutral",
      analysisText: "暂时无法生成 AI 预测。通常来说，平均分高于 3.5 的论文有不错的录用机会。"
    };
  }
};