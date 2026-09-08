import React, { useState } from 'react';
import { Exercise, LengthUnit, AreaUnit, UserStats } from '../types';
import { SAMPLE_EXERCISES, diagnoseAnswer, ValidationFeedback } from '../utils/exerciseData';
import { parseNumberVi, formatNumberVi } from '../utils/mathUtils';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';

interface GuidedSolvePanelProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onViewShapeInStudio?: (exercise: Exercise) => void;
}

export const GuidedSolvePanel: React.FC<GuidedSolvePanelProps> = ({
  stats,
  onUpdateStats,
  onViewShapeInStudio,
}) => {
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const currentExercise: Exercise = SAMPLE_EXERCISES[exerciseIndex % SAMPLE_EXERCISES.length];

  // Step answers
  const [selectedFormula, setSelectedFormula] = useState<string>('');
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [userAnswerNumber, setUserAnswerNumber] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  // Hints
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);

  // Result / Diagnostic
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const handleCheck = () => {
    const val = parseNumberVi(userAnswerNumber);
    const diag = diagnoseAnswer(val, selectedUnit, selectedFormula, currentExercise);
    setFeedback(diag);
    setHasChecked(true);

    if (diag.isCorrect) {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#fbbf24', '#34d399'],
      });

      // Update user stats
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

  const handleNextExercise = () => {
    setExerciseIndex((prev) => prev + 1);
    setSelectedFormula('');
    setUserCalculation('');
    setUserAnswerNumber('');
    setSelectedUnit('');
    setRevealedHintLevel(0);
    setFeedback(null);
    setHasChecked(false);
  };

  const handleResetCurrent = () => {
    setSelectedFormula('');
    setUserCalculation('');
    setUserAnswerNumber('');
    setSelectedUnit('');
    setFeedback(null);
    setHasChecked(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header with Exercise Navigation & Level */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
            {exerciseIndex + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                {currentExercise.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                Cấp độ {currentExercise.level}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentExercise.topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetCurrent}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>
          <button
            type="button"
            onClick={handleNextExercise}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <span>Bài tiếp theo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stepper Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Problem description, Summary, Given data */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* ĐỀ BÀI */}
          <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              1. Đề bài bài toán
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
              {currentExercise.prompt}
            </p>
          </div>

          {/* TÓM TẮT & HÌNH MINH HỌA */}
          <div className="bg-sky-50/70 rounded-2xl border border-sky-200 p-4 sm:p-5 flex flex-col gap-3">
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
              2. Tóm tắt đề bài
            </div>
            <div className="bg-white rounded-xl p-3 border border-sky-100 text-xs sm:text-sm font-medium text-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Dữ kiện đã cho:</span>
                <span className="font-bold text-sky-900">{currentExercise.givenDataText}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Yêu cầu tìm:</span>
                <span className="font-bold text-rose-600">{currentExercise.targetQuestion}</span>
              </div>
            </div>

            {onViewShapeInStudio && (
              <button
                type="button"
                onClick={() => onViewShapeInStudio(currentExercise)}
                className="w-full py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>📐 Mở và vẽ hình này trong Xưởng Vẽ Hình</span>
              </button>
            )}
          </div>

          {/* GỢI Ý 3 MỨC (MỤC XVII) */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Trợ lý gợi ý bài giải (3 mức độ)</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700">
                {revealedHintLevel}/3 mức
              </span>
            </div>

            <div className="flex gap-1.5">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setRevealedHintLevel(lvl)}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition border ${
                    revealedHintLevel >= lvl
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Gợi ý {lvl}
                </button>
              ))}
            </div>

            {revealedHintLevel > 0 && (
              <div className="mt-1 p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed animate-fade-in space-y-1.5">
                {revealedHintLevel >= 1 && (
                  <p className="font-medium text-amber-900">💡 {currentExercise.hints[0]}</p>
                )}
                {revealedHintLevel >= 2 && (
                  <p className="font-medium text-amber-900">📐 {currentExercise.hints[1]}</p>
                )}
                {revealedHintLevel >= 3 && (
                  <p className="font-medium text-amber-900">📝 {currentExercise.hints[2]}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Step-by-step Interactive Form */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
            {/* BƯỚC 1: CHỌN CÔNG THỨC */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Bước 1: Chọn công thức tính phù hợp
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentExercise.formulaOptions.map((formula) => (
                  <button
                    key={formula}
                    type="button"
                    onClick={() => setSelectedFormula(formula)}
                    className={`p-2.5 rounded-xl border text-center font-mono text-sm font-bold transition ${
                      selectedFormula === formula
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs ring-2 ring-sky-200'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {formula}
                  </button>
                ))}
              </div>
            </div>

            {/* BƯỚC 2: NHẬP PHÉP TÍNH */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bước 2: Thay số và viết phép tính
              </label>
              <span className="text-[11px] text-slate-500 block mb-1.5">
                Ví dụ: 12 × 8 = 96 hoặc (12 + 8) × 5 : 2
              </span>
              <input
                type="text"
                value={userCalculation}
                onChange={(e) => setUserCalculation(e.target.value)}
                placeholder="Nhập phép tính tại đây..."
                className="w-full h-11 px-3 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* BƯỚC 3 & 4: ĐÁP SỐ VÀ ĐƠN VỊ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bước 3: Số kết quả (Đáp số)
                </label>
                <input
                  type="text"
                  value={userAnswerNumber}
                  onChange={(e) => setUserAnswerNumber(e.target.value)}
                  placeholder="Ví dụ: 96 hoặc 78,5"
                  className="w-full h-11 px-3 text-sm font-bold text-sky-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bước 4: Chọn đơn vị tương ứng
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  aria-label="Chọn đơn vị đo cho kết quả bài toán"
                  className="w-full h-11 px-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="">-- Chọn đơn vị --</option>
                  {currentExercise.unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NÚT KIỂM TRA LỚN (MỤC XVI) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCheck}
                className="w-full h-13 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-md hover:shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>KIỂM TRA ĐÁP ÁN</span>
              </button>
            </div>

            {/* PHẢN HỒI THÔNG MINH (DIAGNOSTIC FEEDBACK) */}
            {hasChecked && feedback && (
              <div
                className={`p-4 rounded-xl border animate-fade-in flex flex-col gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <h4 className="font-extrabold text-base">
                    {feedback.mainMessage}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed pl-8">
                  {feedback.diagnosticDetail}
                </p>

                <div className="mt-1 pl-8 text-xs font-semibold flex items-center gap-1.5 text-slate-700">
                  <span>💡 Hướng dẫn tiếp theo:</span>
                  <span>{feedback.suggestedAction}</span>
                </div>

                {/* Show full solution if correct */}
                {feedback.isCorrect && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/60 pl-8 text-xs text-emerald-900 font-medium">
                    <span className="font-bold">Lời giải mẫu: </span>
                    {currentExercise.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
