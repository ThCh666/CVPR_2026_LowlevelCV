import { UserSubmission, GlobalStats } from '../types';
import { GOOGLE_SCRIPT_URL, INITIAL_MOCK_DATA } from '../constants';

export const apiService = {
  // 获取全局统计数据
  fetchStats: async (): Promise<GlobalStats> => {
    // 如果没有配置 URL，直接返回模拟数据（避免报错）
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("未配置 GOOGLE_SCRIPT_URL，使用模拟数据");
      return { 
        totalSubmissions: INITIAL_MOCK_DATA.averages.length, 
        allAverages: INITIAL_MOCK_DATA.averages, 
        allRawScores: INITIAL_MOCK_DATA.rawScores 
      };
    }

    try {
      // Google Apps Script 的 GET 请求
      const response = await fetch(GOOGLE_SCRIPT_URL);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error("API Error (Using mock fallback):", error);
      // 网络错误时回退到模拟数据，保证网页可用
      return { 
        totalSubmissions: INITIAL_MOCK_DATA.averages.length, 
        allAverages: INITIAL_MOCK_DATA.averages, 
        allRawScores: INITIAL_MOCK_DATA.rawScores 
      };
    }
  },

  // 提交用户的分数
  submitScore: async (submission: UserSubmission): Promise<GlobalStats> => {
    if (!GOOGLE_SCRIPT_URL) {
       // 演示模式：仅在本地更新 UI，不保存
       return new Promise(resolve => {
         setTimeout(() => {
           resolve({
             totalSubmissions: INITIAL_MOCK_DATA.averages.length + 1,
             allAverages: [...INITIAL_MOCK_DATA.averages, submission.average],
             allRawScores: [...INITIAL_MOCK_DATA.rawScores, ...submission.scores]
           });
         }, 1000);
       });
    }

    // Google Apps Script 的 POST 请求需要特殊处理 CORS
    // 我们使用 no-cors 模式发数据，但 GAS 如果正确配置了 json 返回，通常用 text/plain 能够绕过简单的 option 预检
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(submission),
      // 这里不设置 Content-Type: application/json，因为这会触发复杂的 CORS 预检
      // Apps Script 会把这一堆文本作为 postData.contents 接收
    });

    if (!response.ok) throw new Error('Submission failed');
    return await response.json();
  }
};
