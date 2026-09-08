import React, { useState, useEffect } from 'react';
import {
  ShapeType,
  ShapeData,
  CanvasDisplayOptions,
  UserStats,
  Exercise,
  AppTab,
} from './types';
import { DrawingCanvas } from './components/DrawingCanvas';
import { GeometryToolbar } from './components/GeometryToolbar';
import { PropertyPanel } from './components/PropertyPanel';
import { FormulaPanel } from './components/FormulaPanel';
import { VirtualRuler } from './components/VirtualRuler';
import { DiscoveryMode } from './components/DiscoveryMode';
import { CalculatorView } from './components/CalculatorView';
import { GuidedSolvePanel } from './components/GuidedSolvePanel';
import { ChallengePanel } from './components/ChallengePanel';
import { FormulaBook } from './components/FormulaBook';
import { TeacherModeModal } from './components/TeacherModeModal';
import { AiProblemSolver } from './components/AiProblemSolver';
import { runMandatoryTests } from './utils/mathUtils';
import {
  Compass,
  Grid,
  Ruler,
  Maximize2,
  RotateCcw,
  Sparkles,
  Award,
  GraduationCap,
  Flame,
  Star,
  Layers,
  BookOpen,
  Calculator,
  PenTool,
  Trophy,
  Tv,
  Check,
  Upload,
} from 'lucide-react';

const LOCAL_STORAGE_STATS_KEY = 'xuong_hinh_hoc_5_stats';

const DEFAULT_SHAPE: ShapeData = {
  type: 'rectangle',
  name: 'Hình chữ nhật ABCD',
  points: [],
  length: 8,
  width: 5,
  unit: 'cm',
  showVerticesLabels: true,
  showDimensions: true,
  showAltitude: false,
};

export default function App() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AppTab>('draw');

  // Canvas and Shape state
  const [shape, setShape] = useState<ShapeData>(DEFAULT_SHAPE);
  const [canvasOptions, setCanvasOptions] = useState<CanvasDisplayOptions>({
    showGrid: true,
    showDimensions: true,
    showVerticesLabels: true,
    showAngles: true,
    snapToGrid: true,
  });

  // Ruler state
  const [showRuler, setShowRuler] = useState<boolean>(false);

  // Teacher Mode Modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // User Gamification Stats in LocalStorage
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      points: 20,
      streak: 1,
      completedExercises: 2,
      correctCount: 2,
      wrongCount: 0,
      earnedBadges: ['explorer'],
    };
  });

  // Save stats on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Run test suite on mount in dev/first load to verify 100% mathematical integrity
  useEffect(() => {
    const testResults = runMandatoryTests();
    const allPassed = testResults.every((t) => t.passed);
    if (!allPassed) {
      console.error('Geometry verification errors:', testResults.filter((t) => !t.passed));
    }
  }, []);

  // Handle shape selection from toolbar
  const handleSelectShapeType = (type: ShapeType) => {
    const updated: ShapeData = {
      ...shape,
      type,
      points: [], // Will be recalculated by canvas
    };

    if (type === 'segment') {
      updated.length = 8;
    } else if (type === 'rectangle') {
      updated.length = 8;
      updated.width = 5;
    } else if (type === 'square') {
      updated.side = 6;
    } else if (type === 'triangle') {
      updated.baseA = 8;
      updated.height = 6;
      updated.showAltitude = true;
    } else if (type === 'right_triangle') {
      updated.baseA = 8;
      updated.height = 6;
    } else if (type === 'trapezoid') {
      updated.baseA = 10;
      updated.baseB = 6;
      updated.height = 5;
      updated.showAltitude = true;
    } else if (type === 'parallelogram') {
      updated.baseA = 9;
      updated.height = 5;
      updated.showAltitude = true;
    } else if (type === 'rhombus') {
      updated.diagonal1 = 8;
      updated.diagonal2 = 6;
      updated.side = 5;
    } else if (type === 'circle' || type === 'semicircle') {
      updated.radius = 5;
      updated.diameter = 10;
      updated.circleInputMode = 'radius';
    } else if (type === 'compound') {
      updated.length = 8;
      updated.width = 4;
      updated.height = 4;
    }

    setShape(updated);
  };

  // Switch to studio and load shape from exercise
  const handleOpenExerciseInStudio = (ex: Exercise) => {
    handleSelectShapeType(ex.shapeType);
    setShape((prev) => ({
      ...prev,
      type: ex.shapeType,
      unit: (ex.defaultData.unit || (ex.correctUnit.includes('²') ? 'cm' : ex.correctUnit)) as any,
      length: ex.defaultData.length ?? prev.length,
      width: ex.defaultData.width ?? prev.width,
      side: ex.defaultData.side ?? prev.side,
      baseA: ex.defaultData.baseA ?? prev.baseA,
      baseB: ex.defaultData.baseB ?? prev.baseB,
      height: ex.defaultData.height ?? prev.height,
      radius: ex.defaultData.radius ?? prev.radius,
      diameter: ex.defaultData.diameter ?? prev.diameter,
      diagonal1: ex.defaultData.diagonal1 ?? prev.diagonal1,
      diagonal2: ex.defaultData.diagonal2 ?? prev.diagonal2,
    }));
    setActiveTab('draw');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-amber-400 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                  XƯỞNG HÌNH HỌC 5
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 uppercase">
                  Toán Tiểu học
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Vẽ hình, khám phá và giải toán hình học phẳng lớp 5
              </p>
            </div>
          </div>

          {/* Gamification Stats and Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gamification Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{stats.points} ⭐</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>{stats.streak} 🔥</span>
              </div>
            </div>

            {/* Teacher Mode Button */}
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(true)}
              className="h-9 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5"
              title="Mở bảng điều khiển giáo viên"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Chế độ giáo viên</span>
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS BAR */}
        <div className="bg-slate-50/80 border-t border-slate-200/70 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex gap-1 sm:gap-2 py-1.5">
            {[
              { id: 'draw', label: '1. VẼ HÌNH', icon: <PenTool className="w-4 h-4" /> },
              { id: 'ai_solve', label: '2. TẢI ĐỀ & GIẢI TOÁN AI', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
              { id: 'explore', label: '3. KHÁM PHÁ', icon: <Compass className="w-4 h-4" /> },
              { id: 'calculate', label: '4. TÍNH TOÁN & ĐỔI ĐƠN VỊ', icon: <Calculator className="w-4 h-4" /> },
              { id: 'practice', label: '5. LUYỆN TẬP', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'challenge', label: '6. THỬ THÁCH', icon: <Trophy className="w-4 h-4" /> },
              { id: 'handbook', label: '7. SỔ TAY CÔNG THỨC', icon: <Layers className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-transparent hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-6">
        {/* ================= TAB 1: VẼ HÌNH ================= */}
        {activeTab === 'draw' && (
          <div className="flex flex-col gap-4">
            {/* Shape Selection Toolbar (11 Shapes) */}
            <GeometryToolbar
              currentType={shape.type}
              onSelectShape={handleSelectShapeType}
            />

            {/* Canvas Actions Bar */}
            <div className="bg-white rounded-2xl border border-sky-100 p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Toggle Grid */}
                <button
                  type="button"
                  onClick={() =>
                    setCanvasOptions((prev) => ({ ...prev, showGrid: !prev.showGrid }))
                  }
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    canvasOptions.showGrid
                      ? 'bg-sky-50 border-sky-300 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Lưới ô vuông</span>
                </button>

                {/* Toggle Dimension Labels */}
                <button
                  type="button"
                  onClick={() =>
                    setCanvasOptions((prev) => ({
                      ...prev,
                      showDimensions: !prev.showDimensions,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    canvasOptions.showDimensions
                      ? 'bg-sky-50 border-sky-300 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>Hiện số đo</span>
                </button>

                {/* Toggle Altitude line */}
                {(shape.type === 'triangle' ||
                  shape.type === 'trapezoid' ||
                  shape.type === 'parallelogram') && (
                  <button
                    type="button"
                    onClick={() =>
                      setShape((prev) => ({ ...prev, showAltitude: !prev.showAltitude }))
                    }
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      shape.showAltitude
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>Đường cao (h)</span>
                  </button>
                )}

                {/* Toggle Virtual Ruler */}
                <button
                  type="button"
                  onClick={() => setShowRuler(!showRuler)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    showRuler
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showRuler ? 'Ẩn thước kẻ cm' : 'Mở thước kẻ cm'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai_solve')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  title="Tải ảnh, PDF, Word hoặc dán đề bài để AI vẽ hình và giải"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tải đề / ảnh giải AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectShapeType(shape.type)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1"
                  title="Đặt lại vị trí hình"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Căn giữa</span>
                </button>
              </div>
            </div>

            {/* Drawing Area & Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Main SVG Interactive Canvas (Takes 7 or 8 cols on desktop) */}
              <div className="lg:col-span-8 flex flex-col gap-2 relative">
                <DrawingCanvas
                  shape={shape}
                  onChangeShape={setShape}
                  options={canvasOptions}
                />

                {/* Virtual Draggable Ruler Component */}
                {showRuler && <VirtualRuler onClose={() => setShowRuler(false)} />}
              </div>

              {/* Side Panels: Dimensions & Formulas (Takes 4 or 5 cols on desktop) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Property & Dimension Controller */}
                <PropertyPanel shape={shape} onChangeShape={setShape} />

                {/* Live Formula & Calculation Panel */}
                <FormulaPanel shape={shape} />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TẢI ĐỀ & GIẢI TOÁN AI ================= */}
        {activeTab === 'ai_solve' && (
          <AiProblemSolver
            onLoadShapeToStudio={(shapeData) => {
              if (shapeData.type) {
                handleSelectShapeType(shapeData.type);
              }
              setShape((prev) => ({
                ...prev,
                ...shapeData,
                points: [],
              }));
              setActiveTab('draw');
            }}
            onLoadToPractice={(customEx) => {
              handleOpenExerciseInStudio(customEx);
              setActiveTab('practice');
            }}
          />
        )}

        {/* ================= TAB 2: KHÁM PHÁ ================= */}
        {activeTab === 'explore' && <DiscoveryMode />}

        {/* ================= TAB 3: TÍNH TOÁN & ĐỔI ĐƠN VỊ ================= */}
        {activeTab === 'calculate' && <CalculatorView />}

        {/* ================= TAB 4: LUYỆN TẬP ================= */}
        {activeTab === 'practice' && (
          <GuidedSolvePanel
            stats={stats}
            onUpdateStats={setStats}
            onViewShapeInStudio={handleOpenExerciseInStudio}
          />
        )}

        {/* ================= TAB 5: THỬ THÁCH ================= */}
        {activeTab === 'challenge' && (
          <ChallengePanel stats={stats} onUpdateStats={setStats} />
        )}

        {/* ================= TAB 6: SỔ TAY CÔNG THỨC ================= */}
        {activeTab === 'handbook' && <FormulaBook />}
      </main>

      {/* 4. TEACHER MODE MODAL */}
      <TeacherModeModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onApplyShapeData={(newShape) => {
          setShape(newShape);
          setActiveTab('draw');
        }}
        onStartPresentation={() => {
          setIsPresentationMode(true);
          setActiveTab('draw');
        }}
      />

      {/* 5. FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          XƯỞNG HÌNH HỌC 5 – VẼ HÌNH, KHÁM PHÁ VÀ GIẢI TOÁN
        </p>
        <p className="mt-0.5">
          Thiết kế chuẩn Chương trình Giáo dục Phổ thông Toán Lớp 5 Việt Nam • Thân thiện cho giáo viên và học sinh
        </p>
      </footer>
    </div>
  );
}
