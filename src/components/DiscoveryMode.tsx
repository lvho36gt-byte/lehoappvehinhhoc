import React, { useState } from 'react';
import { formatNumberVi } from '../utils/mathUtils';
import { Sparkles, TrendingUp, Info } from 'lucide-react';

export const DiscoveryMode: React.FC = () => {
  const [shapeMode, setShapeMode] = useState<'rect_len' | 'rect_width' | 'sq_side' | 'cir_radius'>('rect_len');
  const [sliderVal, setSliderVal] = useState<number>(8);
  const [fixedVal, setFixedVal] = useState<number>(5); // e.g. width = 5 cm

  // Generate sequence of values around current sliderVal to show dynamic scaling table
  const steps = [-2, -1, 0, 1, 2].map((offset) => Math.max(1, sliderVal + offset));
  // Remove duplicates
  const uniqueSteps = Array.from(new Set(steps)).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 text-white rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 text-cyan-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Khám phá mối quan hệ hình học</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Quan sát Chu vi & Diện tích biến đổi theo thời gian thực
        </h2>
        <p className="text-sky-100 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
          Kéo thanh trượt để thay đổi một kích thước và xem trực tiếp chu vi, diện tích tăng hoặc giảm như thế nào. Học toán hình học bằng trực giác!
        </p>
      </div>

      {/* Select discovery topic */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => { setShapeMode('rect_len'); setSliderVal(8); setFixedVal(5); }}
          className={`p-3 rounded-xl border text-left transition ${
            shapeMode === 'rect_len'
              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="text-xs text-slate-500">Hình chữ nhật</div>
          <div className="text-sm font-bold mt-0.5">Tăng Chiều dài (a)</div>
          <div className="text-[11px] text-sky-700 font-medium">Chiều rộng cố định {fixedVal} cm</div>
        </button>

        <button
          type="button"
          onClick={() => { setShapeMode('rect_width'); setSliderVal(5); setFixedVal(8); }}
          className={`p-3 rounded-xl border text-left transition ${
            shapeMode === 'rect_width'
              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="text-xs text-slate-500">Hình chữ nhật</div>
          <div className="text-sm font-bold mt-0.5">Tăng Chiều rộng (b)</div>
          <div className="text-[11px] text-sky-700 font-medium">Chiều dài cố định {fixedVal} cm</div>
        </button>

        <button
          type="button"
          onClick={() => { setShapeMode('sq_side'); setSliderVal(6); }}
          className={`p-3 rounded-xl border text-left transition ${
            shapeMode === 'sq_side'
              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="text-xs text-slate-500">Hình vuông</div>
          <div className="text-sm font-bold mt-0.5">Tăng Cạnh (a)</div>
          <div className="text-[11px] text-sky-700 font-medium">Cả 4 cạnh cùng tăng</div>
        </button>

        <button
          type="button"
          onClick={() => { setShapeMode('cir_radius'); setSliderVal(5); }}
          className={`p-3 rounded-xl border text-left transition ${
            shapeMode === 'cir_radius'
              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="text-xs text-slate-500">Hình tròn</div>
          <div className="text-sm font-bold mt-0.5">Tăng Bán kính (r)</div>
          <div className="text-[11px] text-sky-700 font-medium">Đường kính d = 2 × r</div>
        </button>
      </div>

      {/* Interactive Control & Live Preview */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-sm font-bold text-slate-800 mb-1">
              <span>
                {shapeMode === 'rect_len' && 'Thay đổi Chiều dài: a = '}
                {shapeMode === 'rect_width' && 'Thay đổi Chiều rộng: b = '}
                {shapeMode === 'sq_side' && 'Thay đổi Cạnh hình vuông: a = '}
                {shapeMode === 'cir_radius' && 'Thay đổi Bán kính hình tròn: r = '}
                <span className="text-sky-600 text-lg font-black">{sliderVal} cm</span>
              </span>
              <span className="text-xs text-slate-500">Phạm vi: 2 đến 16 cm</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="1"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>
        </div>

        {/* Live Step Transformation Table */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-800">
              Bảng giá trị so sánh khi kích thước thay đổi liên tục:
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50 text-sky-900 border-b border-sky-200">
                  <th className="p-2.5 font-bold">Kích thước</th>
                  <th className="p-2.5 font-bold">Chu vi (P hoặc C)</th>
                  <th className="p-2.5 font-bold">Diện tích (S)</th>
                  <th className="p-2.5 font-bold">Nhận xét quy luật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uniqueSteps.map((val) => {
                  let p = 0;
                  let s = 0;
                  let pText = '';
                  let sText = '';
                  let rule = '';
                  const isCurrent = val === sliderVal;

                  if (shapeMode === 'rect_len') {
                    p = (val + fixedVal) * 2;
                    s = val * fixedVal;
                    pText = `(${val} + ${fixedVal}) × 2 = ${p} cm`;
                    sText = `${val} × ${fixedVal} = ${s} cm²`;
                    rule = `Chiều dài tăng 1 cm ➔ Chu vi tăng đúng 2 cm; Diện tích tăng thêm ${fixedVal} cm²`;
                  } else if (shapeMode === 'rect_width') {
                    p = (fixedVal + val) * 2;
                    s = fixedVal * val;
                    pText = `(${fixedVal} + ${val}) × 2 = ${p} cm`;
                    sText = `${fixedVal} × ${val} = ${s} cm²`;
                    rule = `Chiều rộng tăng 1 cm ➔ Chu vi tăng 2 cm; Diện tích tăng thêm ${fixedVal} cm²`;
                  } else if (shapeMode === 'sq_side') {
                    p = val * 4;
                    s = val * val;
                    pText = `${val} × 4 = ${p} cm`;
                    sText = `${val} × ${val} = ${s} cm²`;
                    rule = `Cạnh tăng 1 cm ➔ Chu vi tăng 4 cm; Diện tích tăng không đều (theo a × a)`;
                  } else if (shapeMode === 'cir_radius') {
                    p = Math.round(val * 2 * 3.14 * 100) / 100;
                    s = Math.round(val * val * 3.14 * 100) / 100;
                    pText = `${val * 2} × 3,14 = ${formatNumberVi(p)} cm`;
                    sText = `${val} × ${val} × 3,14 = ${formatNumberVi(s)} cm²`;
                    rule = `Bán kính gấp đôi ➔ Chu vi gấp đôi, nhưng Diện tích gấp lên 4 lần!`;
                  }

                  return (
                    <tr
                      key={val}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-amber-50/90 font-bold border-l-4 border-amber-500 text-slate-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          {val} cm
                        </span>
                      </td>
                      <td className="p-2.5 text-sky-800 font-semibold">{pText}</td>
                      <td className="p-2.5 text-emerald-800 font-semibold">{sText}</td>
                      <td className="p-2.5 text-slate-600 text-xs">{rule}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discovery Lesson Box */}
        <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-200 flex items-start gap-2.5 text-xs sm:text-sm text-sky-950">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-sky-900">Bài học khám phá quan trọng:</span>
            <p className="mt-0.5 text-slate-700">
              {shapeMode === 'cir_radius'
                ? 'Khi bán kính của một hình tròn gấp lên n lần thì chu vi cũng gấp lên n lần, nhưng diện tích của hình tròn đó lại gấp lên n × n lần!'
                : shapeMode === 'sq_side'
                ? 'Khi cạnh hình vuông gấp lên 2 lần thì chu vi gấp lên 2 lần, còn diện tích gấp lên 2 × 2 = 4 lần.'
                : 'Chu vi chỉ phụ thuộc vào bậc 1 của kích thước (đơn vị độ dài cm), trong khi diện tích là tích của 2 kích thước (đơn vị diện tích cm²).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
