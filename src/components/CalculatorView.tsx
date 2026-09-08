import React, { useState } from 'react';
import { LengthUnit, AreaUnit } from '../types';
import {
  LENGTH_UNITS,
  AREA_UNITS,
  convertLength,
  convertArea,
  formatNumberVi,
  parseNumberVi,
  LENGTH_FACTORS_TO_METERS,
  AREA_FACTORS_TO_SQ_METERS,
} from '../utils/mathUtils';
import { ArrowRightLeft, Sparkles, BookOpen, Calculator, CheckCircle2 } from 'lucide-react';

export const CalculatorView: React.FC = () => {
  // Conversion tab: length or area
  const [conversionType, setConversionType] = useState<'length' | 'area'>('length');
  const [inputValue, setInputValue] = useState<string>('2,5');
  const [fromLength, setFromLength] = useState<LengthUnit>('m');
  const [toLength, setToLength] = useState<LengthUnit>('cm');

  const [fromArea, setFromArea] = useState<AreaUnit>('m²');
  const [toArea, setToArea] = useState<AreaUnit>('cm²');

  // Quick Area / Perimeter interactive solver
  const [quickShape, setQuickShape] = useState<'rect' | 'square' | 'tri' | 'trap' | 'circle'>('rect');
  const [valA, setValA] = useState<string>('8');
  const [valB, setValB] = useState<string>('5');
  const [valH, setValH] = useState<string>('6');
  const [quickUnit, setQuickUnit] = useState<LengthUnit>('cm');

  // Calculate length conversion
  const parsedVal = parseNumberVi(inputValue);
  const lengthResult = convertLength(parsedVal, fromLength, toLength);
  const areaResult = convertArea(parsedVal, fromArea, toArea);

  return (
    <div className="flex flex-col gap-6">
      {/* SECTION 1: CÔNG CỤ ĐỔI ĐƠN VỊ ĐO (BẮT BUỘC THEO MỤC VI) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Công cụ chuyển đổi đơn vị đo toán lớp 5
              </h2>
              <p className="text-xs text-slate-500">
                Chính xác theo chuẩn Bộ Giáo Dục: Đơn vị độ dài (gấp/kém 10 lần), Đơn vị diện tích (gấp/kém 100 lần)
              </p>
            </div>
          </div>

          {/* Type Toggle: Độ dài vs Diện tích */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setConversionType('length')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                conversionType === 'length'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📏 Độ dài (m, cm, km...)
            </button>
            <button
              type="button"
              onClick={() => setConversionType('area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                conversionType === 'area'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🟩 Diện tích (m², cm², ha...)
            </button>
          </div>
        </div>

        {/* Converter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Input number */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nhập giá trị cần đổi:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập số ví dụ: 2,5"
              className="w-full h-11 px-3 font-bold text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* From Unit */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Từ đơn vị:
            </label>
            {conversionType === 'length' ? (
              <select
                value={fromLength}
                onChange={(e) => setFromLength(e.target.value as LengthUnit)}
                aria-label="Chọn đơn vị độ dài ban đầu"
                className="w-full h-11 px-3 font-bold text-sm text-sky-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            ) : (
              <select
                value={fromArea}
                onChange={(e) => setFromArea(e.target.value as AreaUnit)}
                aria-label="Chọn đơn vị diện tích ban đầu"
                className="w-full h-11 px-3 font-bold text-sm text-emerald-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {AREA_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            )}
          </div>

          {/* Arrow */}
          <div className="sm:col-span-1 flex justify-center text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
              =
            </div>
          </div>

          {/* To Unit */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Sang đơn vị:
            </label>
            {conversionType === 'length' ? (
              <select
                value={toLength}
                onChange={(e) => setToLength(e.target.value as LengthUnit)}
                aria-label="Chọn đơn vị độ dài đích"
                className="w-full h-11 px-3 font-bold text-sm text-sky-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            ) : (
              <select
                value={toArea}
                onChange={(e) => setToArea(e.target.value as AreaUnit)}
                aria-label="Chọn đơn vị diện tích đích"
                className="w-full h-11 px-3 font-bold text-sm text-emerald-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {AREA_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Big Converted Result Display */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider text-sky-100 font-semibold">
              Kết quả quy đổi chính xác:
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-0.5">
              {formatNumberVi(parsedVal)} {conversionType === 'length' ? fromLength : fromArea} ={' '}
              <span className="text-amber-300 underline underline-offset-4 decoration-amber-300/60">
                {formatNumberVi(conversionType === 'length' ? lengthResult : areaResult, 6)}{' '}
                {conversionType === 'length' ? toLength : toArea}
              </span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
            Chuẩn giáo dục Việt Nam
          </div>
        </div>

        {/* Visual Explanation of the Conversion */}
        <div className="bg-sky-50/80 rounded-xl p-4 border border-sky-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-sky-900">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Giải thích các bước chuyển đổi trực quan:</span>
          </div>

          {conversionType === 'length' ? (
            <div>
              <p>
                • Bảng đơn vị đo độ dài từ lớn đến bé:{' '}
                <span className="font-bold text-sky-900">km ➔ hm ➔ dam ➔ m ➔ dm ➔ cm ➔ mm</span>.
              </p>
              <p className="mt-1">
                • Hai đơn vị đo độ dài liền nhau thì đơn vị lớn gấp{' '}
                <span className="font-bold text-rose-600">10 lần</span> đơn vị bé, đơn vị bé bằng{' '}
                <span className="font-bold text-rose-600">1/10 (0,1)</span> đơn vị lớn.
              </p>
              <p className="mt-1 text-slate-800 font-medium">
                ➔ Cụ thể: 1 {fromLength} = {formatNumberVi(convertLength(1, fromLength, toLength), 4)} {toLength}.
                Do đó lấy {formatNumberVi(parsedVal)} × {formatNumberVi(convertLength(1, fromLength, toLength), 4)} ={' '}
                <span className="font-bold text-sky-800">{formatNumberVi(lengthResult, 4)} {toLength}</span>.
              </p>
            </div>
          ) : (
            <div>
              <p>
                • Bảng đơn vị đo diện tích từ lớn đến bé:{' '}
                <span className="font-bold text-emerald-900">km² ➔ hm² (ha) ➔ dam² ➔ m² ➔ dm² ➔ cm² ➔ mm²</span>.
              </p>
              <p className="mt-1">
                • Hai đơn vị diện tích liền nhau thì đơn vị lớn gấp{' '}
                <span className="font-bold text-rose-600">100 lần</span> đơn vị bé, đơn vị bé bằng{' '}
                <span className="font-bold text-rose-600">1/100 (0,01)</span> đơn vị lớn.
              </p>
              <p className="mt-1 font-semibold text-emerald-800">
                • Đặc biệt: 1 ha = 1 hm² = 10 000 m² (Một héc-ta bằng mười nghìn mét vuông).
              </p>
              <p className="mt-1 text-slate-800 font-medium">
                ➔ Cụ thể: 1 {fromArea} = {formatNumberVi(convertArea(1, fromArea, toArea), 6)} {toArea}.
                Do đó lấy {formatNumberVi(parsedVal)} × {formatNumberVi(convertArea(1, fromArea, toArea), 6)} ={' '}
                <span className="font-bold text-emerald-800">{formatNumberVi(areaResult, 6)} {toArea}</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: BẢNG TÍNH NHANH CHU VI & DIỆN TÍCH TÙY CHỌN */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calculator className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-800">Máy tính toán hình học nhanh</h3>
            <p className="text-xs text-slate-500">Nhập bất kỳ số đo bài tập nào để kiểm tra kết quả ngay</p>
          </div>
        </div>

        {/* Choose shape for quick calc */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'rect', label: 'Hình chữ nhật' },
            { id: 'square', label: 'Hình vuông' },
            { id: 'tri', label: 'Hình tam giác' },
            { id: 'trap', label: 'Hình thang' },
            { id: 'circle', label: 'Hình tròn' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setQuickShape(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                quickShape === item.id
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickShape === 'rect' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chiều dài (a):</label>
                <input
                  type="text"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chiều rộng (b):</label>
                <input
                  type="text"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </>
          )}

          {quickShape === 'square' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cạnh hình vuông (a):</label>
              <input
                type="text"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          )}

          {quickShape === 'tri' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Độ dài đáy (a):</label>
                <input
                  type="text"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chiều cao (h):</label>
                <input
                  type="text"
                  value={valH}
                  onChange={(e) => setValH(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </>
          )}

          {quickShape === 'trap' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đáy lớn (a):</label>
                <input
                  type="text"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đáy bé (b):</label>
                <input
                  type="text"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chiều cao (h):</label>
                <input
                  type="text"
                  value={valH}
                  onChange={(e) => setValH(e.target.value)}
                  className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </>
          )}

          {quickShape === 'circle' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bán kính (r):</label>
              <input
                type="text"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị tính:</label>
            <select
              value={quickUnit}
              onChange={(e) => setQuickUnit(e.target.value as LengthUnit)}
              aria-label="Chọn đơn vị tính cho hình"
              className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-300 rounded-lg text-sm"
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Chu vi:</span>
            <div className="text-xl font-black text-sky-800 mt-1">
              {(() => {
                const a = parseNumberVi(valA);
                const b = parseNumberVi(valB);
                if (quickShape === 'rect') return `P = (${valA} + ${valB}) × 2 = ${formatNumberVi((a + b) * 2)} ${quickUnit}`;
                if (quickShape === 'square') return `P = ${valA} × 4 = ${formatNumberVi(a * 4)} ${quickUnit}`;
                if (quickShape === 'circle') return `C = ${valA} × 2 × 3,14 = ${formatNumberVi(a * 2 * 3.14)} ${quickUnit}`;
                return `P = tổng các cạnh bao quanh (${quickUnit})`;
              })()}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Diện tích:</span>
            <div className="text-xl font-black text-emerald-800 mt-1">
              {(() => {
                const a = parseNumberVi(valA);
                const b = parseNumberVi(valB);
                const h = parseNumberVi(valH);
                const au = quickUnit + '²';
                if (quickShape === 'rect') return `S = ${valA} × ${valB} = ${formatNumberVi(a * b)} ${au}`;
                if (quickShape === 'square') return `S = ${valA} × ${valA} = ${formatNumberVi(a * a)} ${au}`;
                if (quickShape === 'tri') return `S = (${valA} × ${valH}) : 2 = ${formatNumberVi((a * h) / 2)} ${au}`;
                if (quickShape === 'trap') return `S = (${valA} + ${valB}) × ${valH} : 2 = ${formatNumberVi(((a + b) * h) / 2)} ${au}`;
                if (quickShape === 'circle') return `S = ${valA} × ${valA} × 3,14 = ${formatNumberVi(a * a * 3.14)} ${au}`;
                return '';
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
