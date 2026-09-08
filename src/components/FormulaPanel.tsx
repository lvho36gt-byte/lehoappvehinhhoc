import React, { useState } from 'react';
import { ShapeData } from '../types';
import { calculateShape } from '../utils/mathUtils';
import { Calculator, BookOpen, Eye, EyeOff, Sparkles } from 'lucide-react';

interface FormulaPanelProps {
  shape: ShapeData;
}

export const FormulaPanel: React.FC<FormulaPanelProps> = ({ shape }) => {
  const [showFormulas, setShowFormulas] = useState<boolean>(true);
  const result = calculateShape(shape);

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-3.5 sm:p-4 shadow-xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">
            Kết quả tính toán & Công thức
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowFormulas(!showFormulas)}
          className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg transition"
          title="Bật/tắt hiển thị chi tiết công thức"
        >
          {showFormulas ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showFormulas ? 'Ẩn công thức' : 'Hiện công thức'}</span>
        </button>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Chu vi (P hoặc C) */}
        <div className="flex flex-col justify-between p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-blue-50/80 border border-sky-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-sky-900">
                {shape.type === 'circle' ? 'Chu vi hình tròn (C)' : 'Chu vi (P)'}
              </span>
              <span className="text-[10px] font-semibold bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-full">
                Độ dài: {result.perimeterUnit}
              </span>
            </div>

            {showFormulas && (
              <div className="mt-1.5 font-mono text-xs text-sky-700 font-semibold bg-white/70 px-2 py-1 rounded border border-sky-100">
                {result.perimeterFormula}
              </div>
            )}

            <div className="mt-2 text-xs text-slate-600 font-medium leading-relaxed">
              {result.perimeterSteps}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Đáp số chu vi:</span>
            <span className="text-xl font-extrabold text-sky-800">
              {shape.type === 'segment' ? 'AB = ' : 'P = '}
              {result.perimeter.toLocaleString('vi-VN')} {result.perimeterUnit}
            </span>
          </div>
        </div>

        {/* Diện tích (S) */}
        <div className="flex flex-col justify-between p-3 rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-900">
                Diện tích (S)
              </span>
              <span className="text-[10px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Diện tích: {result.areaUnit}
              </span>
            </div>

            {showFormulas && (
              <div className="mt-1.5 font-mono text-xs text-emerald-800 font-semibold bg-white/70 px-2 py-1 rounded border border-emerald-100">
                {result.areaFormula}
              </div>
            )}

            <div className="mt-2 text-xs text-slate-600 font-medium leading-relaxed">
              {result.areaSteps}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Đáp số diện tích:</span>
            <span className="text-xl font-extrabold text-emerald-800">
              S = {result.area.toLocaleString('vi-VN')} {result.areaUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Note Callout */}
      {result.extraNotes && result.extraNotes.length > 0 && (
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold">Ghi nhớ lớp 5:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              {result.extraNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
