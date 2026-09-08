import React from 'react';
import { ShapeType } from '../types';

interface GeometryToolbarProps {
  currentType: ShapeType;
  onSelectShape: (type: ShapeType) => void;
}

interface ShapeOption {
  type: ShapeType;
  label: string;
  iconSvg: React.ReactNode;
}

export const GeometryToolbar: React.FC<GeometryToolbarProps> = ({ currentType, onSelectShape }) => {
  const options: ShapeOption[] = [
    {
      type: 'rectangle',
      label: 'Hình chữ nhật',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="2" y="5" width="20" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      type: 'square',
      label: 'Hình vuông',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="4" y="4" width="16" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      type: 'triangle',
      label: 'Hình tam giác',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="12,3 2,21 22,21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      type: 'right_triangle',
      label: 'Tam giác vuông',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="4,3 4,21 21,21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <polyline points="4,16 9,16 9,21" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      type: 'trapezoid',
      label: 'Hình thang',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="7,5 17,5 22,19 2,19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      type: 'parallelogram',
      label: 'Hình bình hành',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="7,5 22,5 17,19 2,19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      type: 'rhombus',
      label: 'Hình thoi',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      type: 'circle',
      label: 'Hình tròn',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: 'semicircle',
      label: 'Nửa hình tròn',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M 3 16 A 9 9 0 0 1 21 16 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      type: 'segment',
      label: 'Đoạn thẳng',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <line x1="3" y1="20" x2="21" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="3" cy="20" r="2.5" fill="currentColor" />
          <circle cx="21" cy="4" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: 'compound',
      label: 'Hình ghép',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="4" y="11" width="16" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="12,3 4,11 20,11" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-sky-100 p-2 sm:p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Chọn hình học (11 công cụ hình học phẳng lớp 5)
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 sm:gap-2">
        {options.map((opt) => {
          const isActive = currentType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onSelectShape(opt.type)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center min-h-[64px] border ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-200 ring-2 ring-sky-300 ring-offset-1 font-bold scale-[1.02]'
                  : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200/80 hover:border-sky-300 font-medium'
              }`}
            >
              <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                {opt.iconSvg}
              </div>
              <span className="text-[11px] leading-tight line-clamp-1">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
