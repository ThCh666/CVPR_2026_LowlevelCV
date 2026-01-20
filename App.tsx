import React, { useState, useEffect } from 'react';
import ScoreForm from './components/ScoreForm';
import Dashboard from './components/Dashboard';
import { UserSubmission, GlobalStats } from './types';
import { apiService } from './services/api';
import { INITIAL_MOCK_DATA } from './constants';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserSubmission | null>(null);
  // 初始化全局数据，默认使用 Mock 数据防止空白，等 API 加载完成后替换
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalSubmissions: INITIAL_MOCK_DATA.averages.length,
    allAverages: INITIAL_MOCK_DATA.averages,
    allRawScores: INITIAL_MOCK_DATA.rawScores
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 组件加载时：获取当前最新的统计数据
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await apiService.fetchStats();
        setGlobalStats(stats);
      } catch (error) {
        console.error("Failed to load initial stats:", error);
      }
    };
    loadStats();
  }, []);

  const handleSubmit = async (data: UserSubmission) => {
    setIsSubmitting(true);
    try {
      // 1. 提交数据到 Google Sheets
      // API 返回的是包含最新这一单数据的全新统计结果
      const updatedStats = await apiService.submitScore(data);
      
      // 2. 更新全局统计状态
      setGlobalStats(updatedStats);
      
      // 3. 进入 Dashboard 视图
      setUserData(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission error:", error);
      alert("提交失败，请检查网络。将使用本地模式显示。");
      
      // 降级处理：如果在本地或者 API 挂了，手动在前端合并数据以便展示
      setGlobalStats(prev => ({
        totalSubmissions: prev.totalSubmissions + 1,
        allAverages: [...prev.allAverages, data.average],
        allRawScores: [...prev.allRawScores, ...data.scores]
      }));
      setUserData(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserData(null);
    // 重置时也可以选择重新拉取一次最新数据
    apiService.fetchStats().then(setGlobalStats).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#0b0a1f] text-white pb-20 selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <nav className="bg-[#151432]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                  C
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  CVPR<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2026</span> 分数统计
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                底层视觉社区
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {!userData ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in-up">
            <div className="text-center max-w-2xl">
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-4 drop-shadow-lg">
                收到审稿分数了吗？
              </h1>
              <p className="text-lg text-purple-200/80">
                输入您的 CVPR 2026 分数 (1-6)，看看您在底层视觉社区中的排名
              </p>
              <p className="text-sm text-purple-400/50 mt-2">
                当前已统计 {globalStats.totalSubmissions} 份数据
              </p>
            </div>
            <ScoreForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        ) : (
          <Dashboard 
            userData={userData} 
            globalStats={globalStats} 
            onReset={handleReset} 
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-purple-300/40 text-sm">
        <p>&copy; 2026 CVPR 分数统计助手 —— 由底层视觉社区开发</p>
      </footer>
    </div>
  );
};

export default App;