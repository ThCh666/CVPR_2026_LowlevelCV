import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { UserSubmission, GeminiAnalysis } from '../types';
import { INITIAL_MOCK_DATA, AVERAGE_BINS, RAW_SCORE_TEMPLATE } from '../constants';
import { analyzeScores } from '../services/geminiService';

interface DashboardProps {
  userData: UserSubmission;
  onReset: () => void;
}

// Updated colors for dark theme: bright neon-ish colors
const COLORS = ['#ef4444', '#f97316', '#fbbf24', '#a3e635', '#4ade80', '#22d3ee']; // Red -> Orange -> Yellow -> Lime -> Green -> Cyan

const Dashboard: React.FC<DashboardProps> = ({ userData, onReset }) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  // Combine Mock Data with User Data for "Live" Stats
  const stats = useMemo(() => {
    // 1. Process Average Distribution
    const allAverages = [...INITIAL_MOCK_DATA.averages, userData.average];
    const avgBins = AVERAGE_BINS.map(bin => ({ ...bin, count: 0 }));
    
    allAverages.forEach(avg => {
      const bin = avgBins.find(b => avg >= b.min && avg <= b.max);
      if (bin) bin.count++;
    });

    // 2. Process Pie Chart (Raw Scores)
    const allRawScores = [...INITIAL_MOCK_DATA.rawScores, ...userData.scores];
    const pieData = RAW_SCORE_TEMPLATE.map(t => ({ ...t, count: 0 }));
    
    allRawScores.forEach(score => {
      const slot = pieData.find(p => p.score === score);
      if (slot) slot.count++;
    });

    return { avgBins, pieData };
  }, [userData]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingAnalysis(true);
      const result = await analyzeScores(userData.scores);
      setAnalysis(result);
      setLoadingAnalysis(false);
    };
    fetchAnalysis();
  }, [userData]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151432] p-6 rounded-2xl shadow-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500"></div>
          <span className="text-purple-300 text-sm font-medium uppercase tracking-wider relative z-10">您的平均分</span>
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mt-2 relative z-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{userData.average.toFixed(2)}</span>
        </div>
        
        {/* Gemini AI Insight Card */}
        <div className="md:col-span-2 bg-[#1c1b42] p-6 rounded-2xl shadow-lg border border-purple-500/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <svg className="w-32 h-32 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          </div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full"></div>
          
          {loadingAnalysis ? (
            <div className="flex items-center space-x-3 h-full relative z-10">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
              <span className="text-purple-200 font-medium">正在生成 AI 分析...</span>
            </div>
          ) : analysis ? (
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${
                  analysis.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  analysis.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {analysis.prediction}
                </span>
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/20">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span className="text-[10px] text-purple-300 font-bold tracking-wider">GEMINI AI</span>
                </div>
              </div>
              <p className="text-gray-100 leading-relaxed text-sm md:text-base font-light">
                {analysis.analysisText}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution Chart */}
        <div className="bg-[#151432] p-6 rounded-2xl shadow-lg border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <span className="w-1 h-5 bg-purple-500 rounded-full mr-2"></span>
            平均分分布图
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.avgBins} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="range" 
                  tick={{fontSize: 10, fill: '#a78bfa'}} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  stroke="#4c1d95"
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 92, 246, 0.1)'}}
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    borderColor: '#4c1d95', 
                    borderRadius: '8px', 
                    color: '#fff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#e9d5ff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.avgBins.map((entry, index) => {
                    const isUserBin = userData.average >= entry.min && userData.average <= entry.max;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isUserBin ? '#a855f7' : '#312e81'} // User: Purple-500, Others: Indigo-900
                        stroke={isUserBin ? '#d8b4fe' : 'transparent'}
                        strokeWidth={isUserBin ? 2 : 0}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-purple-300/50 mt-2">
            基于 {INITIAL_MOCK_DATA.averages.length + 1} 份提交数据的对比。紫色高亮柱状图代表您的区间。
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#151432] p-6 rounded-2xl shadow-lg border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
             <span className="w-1 h-5 bg-purple-500 rounded-full mr-2"></span>
             全部分数分布 (1-6分)
          </h3>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  stroke="none"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    borderColor: '#4c1d95', 
                    borderRadius: '8px', 
                    color: '#fff',
                  }}
                />
                <Legend iconType="circle" formatter={(value) => <span style={{ color: '#d8b4fe' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-purple-300/50 mt-2">
            所有提交分数的单项分布情况
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-[#1e1b4b] border border-purple-500/30 text-purple-200 font-semibold rounded-lg hover:bg-[#2e2a5b] hover:text-white transition shadow-[0_0_15px_rgba(147,51,234,0.15)]"
        >
          提交另一篇
        </button>
      </div>
    </div>
  );
};

export default Dashboard;