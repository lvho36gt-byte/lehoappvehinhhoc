import React, { useState, useEffect } from 'react';
import { ShapeData, LengthUnit } from '../types';
import { LENGTH_UNITS, formatNumberVi, parseNumberVi } from '../utils/mathUtils';
import { Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

interface PropertyPanelProps {
  shape: ShapeData;
  onChangeShape: (newShape: ShapeData) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ shape, onChangeShape }) => {
  // Local string inputs to allow natural typing like "2," or "2.5"
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync inputs when shape props change externally (like dragging)
  useEffect(() => {
    setInputs({
      length: shape.length != null ? formatNumberVi(shape.length) : '',
      width: shape.width != null ? formatNumberVi(shape.width) : '',
      side: shape.side != null ? formatNumberVi(shape.side) : '',
      baseA: shape.baseA != null ? formatNumberVi(shape.baseA) : '',
      baseB: shape.baseB != null ? formatNumberVi(shape.baseB) : '',
      height: shape.height != null ? formatNumberVi(shape.height) : '',
      radius: shape.radius != null ? formatNumberVi(shape.radius) : '',
      diameter: shape.diameter != null ? formatNumberVi(shape.diameter) : '',
      diagonal1: shape.diagonal1 != null ? formatNumberVi(shape.diagonal1) : '',
      diagonal2: shape.diagonal2 != null ? formatNumberVi(shape.diagonal2) : '',
    });
  }, [
    shape.length,
    shape.width,
    shape.side,
    shape.baseA,
    shape.baseB,
    shape.height,
    shape.radius,
    shape.diameter,
    shape.diagonal1,
    shape.diagonal2,
  ]);

  const handleInputChange = (field: string, text: string) => {
    setInputs((prev) => ({ ...prev, [field]: text }));
    setErrorMessage(null);

    const val = parseNumberVi(text);

    // Validation rules
    if (text.trim() === '') return;
    if (isNaN(val) || val <= 0) {
      setErrorMessage('Số đo phải là số dương lớn hơn 0 nhé!');
      return;
    }

    const updated = { ...shape };

    if (field === 'length') updated.length = val;
    if (field === 'width') updated.width = val;
    if (field === 'side') updated.side = val;
    if (field === 'baseA') updated.baseA = val;
    if (field === 'baseB') updated.baseB = val;
    if (field === 'height') updated.height = val;
    if (field === 'diagonal1') updated.diagonal1 = val;
    if (field === 'diagonal2') updated.diagonal2 = val;

    if (field === 'radius') {
      updated.radius = val;
      updated.diameter = val * 2;
    }
    if (field === 'diameter') {
      updated.diameter = val;
      updated.radius = val / 2;
    }

    onChangeShape(updated);
  };

  const handleStep = (field: string, delta: number) => {
    const curVal = parseNumberVi(inputs[field] || '1');
    const newVal = Math.max(0.5, Math.round((curVal + delta) * 10) / 10);
    handleInputChange(field, newVal.toString());
  };

  const handleUnitChange = (u: LengthUnit) => {
    onChangeShape({ ...shape, unit: u });
  };

  const renderInputField = (label: string, field: string, note?: string) => (
    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">{label}</span>
        {note && <span className="text-[11px] text-slate-500">{note}</span>}
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <button
          type="button"
          onClick={() => handleStep(field, -1)}
          className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center text-sm"
        >
          -
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={inputs[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-2 text-center font-bold text-sky-900 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="0"
          />
        </div>
        <button
          type="button"
          onClick={() => handleStep(field, 1)}
          className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center text-sm"
        >
          +
        </button>
        <span className="text-xs font-semibold text-slate-500 min-w-6 text-center">
          {shape.unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-3 sm:p-4 shadow-xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-800">Thông số kích thước</h3>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Đơn vị:</span>
          <select
            value={shape.unit}
            onChange={(e) => handleUnitChange(e.target.value as LengthUnit)}
            aria-label="Chọn đơn vị đo độ dài"
            className="h-8 px-2 py-0.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dynamic fields based on shape */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {shape.type === 'segment' && (
          renderInputField('Độ dài đoạn thẳng AB (a)', 'length')
        )}

        {shape.type === 'rectangle' && (
          <>
            {renderInputField('Chiều dài (a)', 'length', 'Cạnh dài')}
            {renderInputField('Chiều rộng (b)', 'width', 'Cạnh ngắn')}
          </>
        )}

        {shape.type === 'square' && (
          renderInputField('Độ dài cạnh (a)', 'side', '4 cạnh đều bằng nhau')
        )}

        {(shape.type === 'triangle' || shape.type === 'right_triangle') && (
          <>
            {renderInputField('Độ dài đáy (a)', 'baseA', 'Cạnh đáy')}
            {renderInputField('Chiều cao tương ứng (h)', 'height', 'Đường cao')}
          </>
        )}

        {shape.type === 'trapezoid' && (
          <>
            {renderInputField('Đáy lớn (a)', 'baseA', 'Đáy dài')}
            {renderInputField('Đáy bé (b)', 'baseB', 'Đáy ngắn')}
            {renderInputField('Chiều cao (h)', 'height', 'Khoảng cách 2 đáy')}
          </>
        )}

        {shape.type === 'parallelogram' && (
          <>
            {renderInputField('Độ dài đáy (a)', 'baseA', 'Cạnh đáy')}
            {renderInputField('Chiều cao tương ứng (h)', 'height', 'Đường cao')}
          </>
        )}

        {shape.type === 'rhombus' && (
          <>
            {renderInputField('Đường chéo 1 (d₁ / m)', 'diagonal1', 'Đường chéo ngang')}
            {renderInputField('Đường chéo 2 (d₂ / n)', 'diagonal2', 'Đường chéo dọc')}
            {renderInputField('Độ dài cạnh (a)', 'side', '4 cạnh đều bằng nhau')}
          </>
        )}

        {(shape.type === 'circle' || shape.type === 'semicircle') && (
          <>
            <div className="sm:col-span-2 flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg">
              <span className="text-xs font-semibold text-slate-600">Cách nhập:</span>
              <button
                type="button"
                onClick={() => onChangeShape({ ...shape, circleInputMode: 'radius' })}
                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold transition ${
                  shape.circleInputMode !== 'diameter'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dùng Bán kính (r)
              </button>
              <button
                type="button"
                onClick={() => onChangeShape({ ...shape, circleInputMode: 'diameter' })}
                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold transition ${
                  shape.circleInputMode === 'diameter'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dùng Đường kính (d)
              </button>
            </div>

            {shape.circleInputMode === 'diameter' ? (
              <>
                {renderInputField('Đường kính (d)', 'diameter', 'd = 2 × r')}
                <div className="flex flex-col justify-center p-2.5 bg-sky-50/70 rounded-xl border border-sky-200 text-xs">
                  <span className="text-slate-500 font-medium">Bán kính suy ra:</span>
                  <span className="font-bold text-sky-800 text-sm">
                    r = d : 2 = {formatNumberVi((shape.diameter ?? 10) / 2)} {shape.unit}
                  </span>
                </div>
              </>
            ) : (
              <>
                {renderInputField('Bán kính (r)', 'radius', 'Từ tâm O tới mép')}
                <div className="flex flex-col justify-center p-2.5 bg-sky-50/70 rounded-xl border border-sky-200 text-xs">
                  <span className="text-slate-500 font-medium">Đường kính suy ra:</span>
                  <span className="font-bold text-sky-800 text-sm">
                    d = 2 × r = {formatNumberVi((shape.radius ?? 5) * 2)} {shape.unit}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {shape.type === 'compound' && (
          <>
            {renderInputField('Chiều dài phần chữ nhật (a)', 'length')}
            {renderInputField('Chiều rộng phần chữ nhật (b)', 'width')}
            {renderInputField('Chiều cao phần tam giác (h)', 'height')}
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Hỗ trợ nhập số thập phân cả dấu phẩy (2,5) và dấu chấm (2.5)</span>
      </div>
    </div>
  );
};
