import React, { useState } from 'react';
import ScoreForm from './components/ScoreForm';
import Dashboard from './components/Dashboard';
import { UserSubmission } from './types';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserSubmission | null>(null);

  const handleSubmit = (data: UserSubmission) => {
    setUserData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setUserData(null);
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
            </div>
            <ScoreForm onSubmit={handleSubmit} />
          </div>
        ) : (
          <Dashboard userData={userData} onReset={handleReset} />
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