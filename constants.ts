import { AverageDistribution, ScoreDistribution } from './types';

// =====================================================================
// 配置区域
// =====================================================================

// TODO: 请将此处替换为您在 Google Apps Script 部署后获得的 "Web App URL"
// 格式如: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydHbw3WxC5nU92HfYycAiDRPVqe9NiJc6IBwkJUKYmtB5Rb8lyLv0h4Et1kZ9KVcg4/exec"; 

// 如果上面的 URL 为空，或者网络请求失败，将回退使用此本地数据
export const USE_MOCK_DATA = true; 

export const MOCK_CONFIG = {
  count: 860, 
  mean: 3.15, 
  distribution: {
    strongReject: 0.10, 
    reject: 0.20,      
    borderline: 0.40,  
    weakAccept: 0.20,  
    accept: 0.08,      
    strongAccept: 0.02 
  }
};

// =====================================================================
// 逻辑区域
// =====================================================================

export const generateMockData = (): { rawScores: number[], averages: number[] } => {
  const rawScores: number[] = [];
  const averages: number[] = [];
  const { count, distribution } = MOCK_CONFIG;
  
  for (let i = 0; i < count; i++) {
    const numReviewers = Math.random() > 0.3 ? 3 : 4;
    let sum = 0;
    for (let j = 0; j < numReviewers; j++) {
      const rand = Math.random();
      let score = 3; 
      if (rand < distribution.strongReject) score = 1;
      else if (rand < distribution.strongReject + distribution.reject) score = 2;
      else if (rand < distribution.strongReject + distribution.reject + distribution.borderline) score = 3;
      else if (rand < distribution.strongReject + distribution.reject + distribution.borderline + distribution.weakAccept) score = 4;
      else if (rand < distribution.strongReject + distribution.reject + distribution.borderline + distribution.weakAccept + distribution.accept) score = 5;
      else score = 6;
      rawScores.push(score);
      sum += score;
    }
    averages.push(Number((sum / numReviewers).toFixed(2)));
  }
  return { rawScores, averages };
};

export const INITIAL_MOCK_DATA = generateMockData();

export const AVERAGE_BINS: AverageDistribution[] = [
  { range: '1.0 - 1.5', min: 1.0, max: 1.5, count: 0 },
  { range: '1.51 - 2.0', min: 1.51, max: 2.0, count: 0 },
  { range: '2.01 - 2.5', min: 2.01, max: 2.5, count: 0 },
  { range: '2.51 - 3.0', min: 2.51, max: 3.0, count: 0 },
  { range: '3.01 - 3.5', min: 3.01, max: 3.5, count: 0 },
  { range: '3.51 - 4.0', min: 3.51, max: 4.0, count: 0 },
  { range: '4.01 - 4.5', min: 4.01, max: 4.5, count: 0 },
  { range: '4.51 - 5.0', min: 4.51, max: 5.0, count: 0 },
  { range: '5.01 - 6.0', min: 5.01, max: 6.0, count: 0 },
];

export const RAW_SCORE_TEMPLATE: ScoreDistribution[] = [
  { score: 1, count: 0 },
  { score: 2, count: 0 },
  { score: 3, count: 0 },
  { score: 4, count: 0 },
  { score: 5, count: 0 },
  { score: 6, count: 0 },
];
