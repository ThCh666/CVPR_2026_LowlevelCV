export interface ScoreDistribution {
  score: number;
  count: number;
}

export interface AverageDistribution {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface UserSubmission {
  scores: number[];
  average: number;
}

export interface GeminiAnalysis {
  prediction: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  analysisText: string;
}

export interface GlobalStats {
  totalSubmissions: number;
  allAverages: number[];
  allRawScores: number[];
}