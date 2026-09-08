import React, { useState } from 'react';
import { ShapeType, ShapeData, LengthUnit } from '../types';
import { LENGTH_UNITS, formatNumberVi } from '../utils/mathUtils';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Maximize2,
  X,
  Shuffle,
  CheckCircle,
  Tv,
} from 'lucide-react';

interface TeacherModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyShapeData: (shape: ShapeData) => void;
  onStartPresentation: () => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  isOpen,
  onClose,
  onApplyShapeData,
  onStartPresentation,
}) => {
  if (!isOpen) return null;

  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [unit, setUnit] = useState<LengthUnit>('cm');
  const [val1, setVal1] = useState<string>('12');
  const [val2, setVal2] = useState<string>('8');
  const [valH, setValH] = useState<string>('6');
  const [showAnswerToClass, setShowAnswerToClass] = useState<boolean>(false);
  const [showFormulaToClass, setShowFormulaToClass] = useState<boolean>(true);
  const [showDimensionsToClass, setShowDimensionsToClass] = useState<boolean>(true);

  const handleCreateExercise = () => {
    const v1 = parseFloat(val1.replace(',', '.')) || 8;
    const v2 = parseFloat(val2.replace(',', '.')) || 5;
    const vh = parseFloat(valH.replace(',', '.')) || 6;

    let shapeObj: ShapeData = {
      type: shapeType,
      name: 'Bài giảng của Giáo viên',
      points: [],
      unit,
    };

    if (shapeType === 'rectangle') {
      shapeObj.length = v1;
      shapeObj.width = v2;
    } else if (shapeType === 'square') {
      shapeObj.side = v1;
    } else if (shapeType === 'triangle') {
      shapeObj.baseA = v1;
      shapeObj.height = vh;
    } else if (shapeType === 'trapezoid') {
      shapeObj.baseA = v1;
      shapeObj.baseB = v2;
      shapeObj.height = vh;
    } else if (shapeType === 'circle') {
      shapeObj.radius = v1;
      shapeObj.diameter = v1 * 2;
    }

    onApplyShapeData(shapeObj);
    onClose();
  };

  const handleRandomize = () => {
    const types: ShapeType[] = ['rectangle', 'square', 'triangle', 'trapezoid', 'circle'];
    const t = types[Math.floor(Math.random() * types.length)];
    setShapeType(t);
    setVal1((Math.floor(Math.random() * 8) + 5).toString());
    setVal2((Math.floor(Math.random() * 5) + 3).toString());
    setValH((Math.floor(Math.random() * 5) + 4).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-sky-100 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black">Bảng Điều Khiển Dành Cho Giáo Viên</h2>
              <p className="text-xs text-sky-200">
                Tạo bài giảng, chỉnh thông số lớp học & trình chiếu TV
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Quick random button */}
          <div className="flex justify-between items-center bg-sky-50 p-3 rounded-2xl border border-sky-200">
            <span className="text-xs font-bold text-sky-900">
              Cần câu hỏi nhanh cho cả lớp thảo luận?
            </span>
            <button
              type="button"
              onClick={handleRandomize}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 transition"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Tạo ngẫu nhiên</span>
            </button>
          </div>

          {/* Form to choose shape and values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chọn hình học giảng dạy:
              </label>
              <select
                value={shapeType}
                onChange={(e) => setShapeType(e.target.value as ShapeType)}
                aria-label="Chọn hình học giảng dạy"
                className="w-full h-10 px-3 text-xs font-bold text-sky-900 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="rectangle">Hình chữ nhật</option>
                <option value="square">Hình vuông</option>
                <option value="triangle">Hình tam giác</option>
                <option value="trapezoid">Hình thang</option>
                <option value="parallelogram">Hình bình hành</option>
                <option value="rhombus">Hình thoi</option>
                <option value="circle">Hình tròn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đơn vị đo:
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as LengthUnit)}
                aria-label="Chọn đơn vị đo bài giảng"
                className="w-full h-10 px-3 text-xs font-bold text-sky-900 bg-slate-50 border border-slate-300 rounded-xl"
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic input values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Kích thước 1 (a / r):
              </label>
              <input
                type="text"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full h-9 px-2 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg"
              />
            </div>

            {(shapeType === 'rectangle' || shapeType === 'trapezoid') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kích thước 2 (b):
                </label>
                <input
                  type="text"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full h-9 px-2 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg"
                />
              </div>
            )}

            {(shapeType === 'triangle' || shapeType === 'trapezoid' || shapeType === 'parallelogram') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Chiều cao (h):
                </label>
                <input
                  type="text"
                  value={valH}
                  onChange={(e) => setValH(e.target.value)}
                  className="w-full h-9 px-2 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Presentation and display toggles for classroom projector */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700">Tùy chọn hiển thị trên bảng lớp:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setShowDimensionsToClass(!showDimensionsToClass)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                  showDimensionsToClass
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {showDimensionsToClass ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Hiện số đo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFormulaToClass(!showFormulaToClass)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                  showFormulaToClass
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {showFormulaToClass ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Hiện công thức</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAnswerToClass(!showAnswerToClass)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                  showAnswerToClass
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {showAnswerToClass ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Hiện đáp số</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              handleCreateExercise();
              onStartPresentation();
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Tv className="w-4 h-4" />
            <span>Trình chiếu màn hình lớp học</span>
          </button>

          <button
            type="button"
            onClick={handleCreateExercise}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Áp dụng vào xưởng vẽ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
