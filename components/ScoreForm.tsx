import React, { useState } from 'react';
import { UserSubmission } from '../types';

interface ScoreFormProps {
  onSubmit: (submission: UserSubmission) => void;
  isLoading?: boolean;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onSubmit, isLoading = false }) => {
  const [scores, setScores] = useState<(string)[]>(['', '', '']); // Start with 3 empty scores
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);

    if (value === '') {
      setError(null);
      return;
    }

    const num = Number(value);
    if (isNaN(num) || num < 1 || num > 6) {
      setError('分数必须在 1 到 6 之间');
    } else if (!Number.isInteger(num)) {
      setError('分数必须是整数');
    } else {
      setError(null);
    }
  };

  const toggleReviewerCount = () => {
    if (scores.length === 3) {
      setScores([...scores, '']);
    } else {
      setScores(scores.slice(0, 3));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const numericScores: number[] = [];
    for (const s of scores) {
      if (s === '') {
        setError("请填写所有分数栏。");
        return;
      }
      const num = Number(s);
      if (isNaN(num) || num < 1 || num > 6 || !Number.isInteger(num)) {
        setError("分数必须在 1 到 6 之间");
        return;
      }
      numericScores.push(num);
    }

    const sum = numericScores.reduce((a, b) => a + b, 0);
    const average = parseFloat((sum / numericScores.length).toFixed(2));

    onSubmit({
      scores: numericScores,
      average: average
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#151432] rounded-2xl shadow-2xl overflow-hidden border border-white/10 ring-1 ring-white/5">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">输入您的分数</h2>
        <p className="text-purple-200 text-sm relative z-10">CVPR 2026 审稿季</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {scores.map((score, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-purple-200 mb-1 ml-1">
                  审稿人 {index + 1}
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={score}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  className="w-full p-3 bg-[#0b0a1f] border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-center text-lg font-mono font-bold text-white placeholder-purple-800/50"
                  placeholder="1-6"
                  required
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleReviewerCount}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium underline decoration-dotted underline-offset-4 transition-colors"
              disabled={isLoading}
            >
              {scores.length === 3 ? "+ 添加第4位审稿人" : "- 移除第4位审稿人"}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transform transition border border-white/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>处理中...</span>
              </div>
            ) : "开始统计"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreForm;