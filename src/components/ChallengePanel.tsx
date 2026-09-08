import React, { useState } from 'react';
import { Exercise, UserStats } from '../types';
import { TOPICS, BADGES, generateRandomExercise, diagnoseAnswer, ValidationFeedback } from '../utils/exerciseData';
import { parseNumberVi, formatNumberVi } from '../utils/mathUtils';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Star,
  Target,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
} from 'lucide-react';

interface ChallengePanelProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const ChallengePanel: React.FC<ChallengePanelProps> = ({ stats, onUpdateStats }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4>(1);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(() =>
    generateRandomExercise(TOPICS[0], 1)
  );

  const [userVal, setUserVal] = useState<string>('');
  const [userUnit, setUserUnit] = useState<string>('');
  const [userFormula, setUserFormula] = useState<string>('');
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleGenerateNew = () => {
    const ex = generateRandomExercise(selectedTopic, selectedLevel);
    setCurrentExercise(ex);
    setUserVal('');
    setUserUnit('');
    setUserFormula('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleCheck = () => {
    const num = parseNumberVi(userVal);
    const diag = diagnoseAnswer(num, userUnit, userFormula, currentExercise);
    setFeedback(diag);

    if (diag.isCorrect) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      const newPts = stats.points + diag.scoreGained;
      const newStreak = stats.streak + 1;
      const newBadges = [...stats.earnedBadges];
      if (newStreak >= 3 && !newBadges.includes('architect')) newBadges.push('architect');
      if (newPts >= 100 && !newBadges.includes('master_geom')) newBadges.push('master_geom');
      if (stats.completedExercises + 1 >= 10 && !newBadges.includes('grandmaster')) newBadges.push('grandmaster');

      onUpdateStats({
        ...stats,
        points: newPts,
        streak: newStreak,
        completedExercises: stats.completedExercises + 1,
        correctCount: stats.correctCount + 1,
        earnedBadges: newBadges,
      });
    } else {
      onUpdateStats({
        ...stats,
        streak: 0,
        wrongCount: stats.wrongCount + 1,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Gamification Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-200 fill-amber-200" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-amber-100">Điểm số</div>
            <div className="text-2xl font-black">{stats.points} ⭐</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-orange-600 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-200 fill-orange-200" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-orange-100">Đúng liên tiếp</div>
            <div className="text-2xl font-black">{stats.streak} 🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Target className="w-6 h-6 text-sky-200" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-sky-100">Bài đã hoàn thành</div>
            <div className="text-2xl font-black">{stats.completedExercises} / 10</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Trophy className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-emerald-100">Danh hiệu hiện tại</div>
            <div className="text-sm font-black truncate">
              {stats.points >= 100 ? '⭐ Cao thủ hình học' : stats.streak >= 3 ? '📐 Kiến trúc sư nhí' : '🌱 Nhà khám phá'}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase text-slate-500">Huy hiệu thành tích em đã mở khóa</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BADGES.map((b) => {
            const isUnlocked = stats.earnedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-bold'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale text-slate-500'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="text-xs">
                  <div className="font-bold">{b.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Generator Filter */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Đấu trường thử thách Toán hình học 5
            </h2>
            <p className="text-xs text-slate-500">
              Hệ thống tự động sinh số liệu bài toán ngẫu nhiên theo 16 chủ đề và 4 cấp độ
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateNew}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Shuffle className="w-4 h-4" />
            <span>Tạo bài ngẫu nhiên mới</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chủ đề hình học (16 chủ đề):
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                const ex = generateRandomExercise(e.target.value, selectedLevel);
                setCurrentExercise(ex);
                setUserVal('');
                setUserUnit('');
                setFeedback(null);
              }}
              aria-label="Chọn chủ đề bài tập hình học"
              className="w-full h-10 px-3 text-xs font-bold text-sky-900 bg-slate-50 border border-slate-300 rounded-xl"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cấp độ bài tập:
            </label>
            <div className="grid grid-cols-4 gap-1.5 h-10">
              {[
                { lvl: 1, label: 'L1: Biết' },
                { lvl: 2, label: 'L2: Hiểu' },
                { lvl: 3, label: 'L3: Vận dụng' },
                { lvl: 4, label: 'L4: Thử thách' },
              ].map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(item.lvl as any);
                    const ex = generateRandomExercise(selectedTopic, item.lvl as any);
                    setCurrentExercise(ex);
                    setUserVal('');
                    setUserUnit('');
                    setFeedback(null);
                  }}
                  className={`rounded-xl text-[11px] font-bold transition border ${
                    selectedLevel === item.lvl
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Generated Question */}
        <div className="mt-2 p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
              Đề bài dành cho em:
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-200 text-sky-900">
              {currentExercise.topic} • Cấp độ {currentExercise.level}
            </span>
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
            {currentExercise.prompt}
          </p>

          <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-sky-100">
            <span className="font-semibold text-sky-800">Yêu cầu: </span>
            {currentExercise.targetQuestion}
          </div>

          {/* Quick Input & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-2">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Công thức:
              </label>
              <select
                value={userFormula}
                onChange={(e) => setUserFormula(e.target.value)}
                aria-label="Chọn công thức tính toán"
                className="w-full h-10 px-2.5 text-xs font-bold bg-white border border-slate-300 rounded-xl"
              >
                <option value="">-- Chọn công thức --</option>
                {currentExercise.formulaOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Đáp số:
              </label>
              <input
                type="text"
                value={userVal}
                onChange={(e) => setUserVal(e.target.value)}
                placeholder="Nhập số (vd: 36 hoặc 78,5)"
                className="w-full h-10 px-3 text-sm font-bold bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Đơn vị:
              </label>
              <select
                value={userUnit}
                onChange={(e) => setUserUnit(e.target.value)}
                aria-label="Chọn đơn vị đo"
                className="w-full h-10 px-2.5 text-xs font-bold bg-white border border-slate-300 rounded-xl"
              >
                <option value="">-- Đơn vị --</option>
                {currentExercise.unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons: Gợi ý & Kiểm tra */}
          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
            </button>

            <button
              type="button"
              onClick={handleCheck}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>KIỂM TRA ĐÁP ÁN</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed animate-fade-in">
              💡 {currentExercise.hints[0]}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border animate-fade-in flex flex-col gap-1.5 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{feedback.mainMessage}</span>
              </div>
              <p className="text-xs leading-relaxed pl-7">{feedback.diagnosticDetail}</p>
              {feedback.isCorrect && (
                <div className="mt-1 pt-1 border-t border-emerald-200/60 pl-7 text-xs font-semibold text-emerald-800">
                  {currentExercise.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
