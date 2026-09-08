import React from 'react';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface FormulaCardItem {
  name: string;
  badge: string;
  perimeter?: string;
  area: string;
  vars: { [key: string]: string };
  note: string;
  svgPreview: React.ReactNode;
}

export const FormulaBook: React.FC = () => {
  const cards: FormulaCardItem[] = [
    {
      name: 'HÌNH CHỮ NHẬT',
      badge: 'Lớp 4 - 5',
      perimeter: 'P = (a + b) × 2',
      area: 'S = a × b',
      vars: {
        a: 'Chiều dài hình chữ nhật',
        b: 'Chiều rộng hình chữ nhật (cùng đơn vị đo)',
      },
      note: 'Chu vi bằng tổng chiều dài và chiều rộng nhân với 2. Diện tích bằng chiều dài nhân chiều rộng.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <rect x="15" y="10" width="90" height="50" rx="3" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <text x="60" y="8" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">a (dài)</text>
          <text x="110" y="40" textAnchor="start" fontSize="10" fill="#0369a1" fontWeight="bold">b</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH VUÔNG',
      badge: 'Lớp 4 - 5',
      perimeter: 'P = a × 4',
      area: 'S = a × a',
      vars: {
        a: 'Độ dài một cạnh của hình vuông',
      },
      note: 'Hình vuông có 4 cạnh bằng nhau và 4 góc vuông.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <rect x="35" y="10" width="50" height="50" rx="3" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <text x="60" y="8" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">a</text>
          <text x="90" y="40" textAnchor="start" fontSize="10" fill="#0369a1" fontWeight="bold">a</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH TAM GIÁC',
      badge: 'Trọng tâm Lớp 5',
      perimeter: 'P = a + b + c (tổng 3 cạnh)',
      area: 'S = a × h : 2',
      vars: {
        a: 'Độ dài cạnh đáy',
        h: 'Chiều cao tương ứng với đáy đó',
      },
      note: 'Muốn tính diện tích hình tam giác ta lấy độ dài đáy nhân với chiều cao (cùng đơn vị đo) rồi chia cho 2.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <polygon points="60,10 15,60 105,60" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <line x1="60" y1="10" x2="60" y2="60" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
          <polyline points="60,53 67,53 67,60" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          <text x="60" y="68" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">a (đáy)</text>
          <text x="64" y="36" textAnchor="start" fontSize="9" fill="#0284c7" fontWeight="bold">h</text>
        </svg>
      ),
    },
    {
      name: 'TAM GIÁC VUÔNG',
      badge: 'Lớp 5',
      area: 'S = a × b : 2',
      vars: {
        'a, b': 'Độ dài hai cạnh góc vuông',
      },
      note: 'Diện tích tam giác vuông bằng tích độ dài hai cạnh góc vuông chia cho 2.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <polygon points="25,10 25,60 100,60" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <polyline points="25,50 35,50 35,60" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          <text x="16" y="38" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">b</text>
          <text x="62" y="68" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">a</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH THANG',
      badge: 'Trọng tâm Lớp 5',
      area: 'S = (a + b) × h : 2',
      vars: {
        a: 'Độ dài đáy lớn',
        b: 'Độ dài đáy bé',
        h: 'Chiều cao (khoảng cách giữa hai đáy)',
      },
      note: 'Muốn tính diện tích hình thang ta lấy tổng độ dài hai đáy nhân với chiều cao (cùng một đơn vị đo) rồi chia cho 2.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <polygon points="40,15 85,15 110,60 15,60" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <line x1="40" y1="15" x2="40" y2="60" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
          <polyline points="40,53 47,53 47,60" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          <text x="62" y="11" textAnchor="middle" fontSize="9" fill="#0369a1" fontWeight="bold">b (đáy bé)</text>
          <text x="62" y="68" textAnchor="middle" fontSize="9" fill="#0369a1" fontWeight="bold">a (đáy lớn)</text>
          <text x="44" y="40" textAnchor="start" fontSize="9" fill="#0284c7" fontWeight="bold">h</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH BÌNH HÀNH',
      badge: 'Lớp 4 - 5',
      perimeter: 'P = (a + b) × 2',
      area: 'S = a × h',
      vars: {
        a: 'Độ dài đáy',
        h: 'Chiều cao tương ứng với đáy',
      },
      note: 'Diện tích hình bình hành bằng độ dài đáy nhân với chiều cao.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <polygon points="35,15 110,15 90,60 15,60" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <line x1="35" y1="15" x2="35" y2="60" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
          <text x="52" y="68" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">a (đáy)</text>
          <text x="39" y="40" textAnchor="start" fontSize="9" fill="#0284c7" fontWeight="bold">h</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH THOI',
      badge: 'Lớp 4 - 5',
      perimeter: 'P = a × 4',
      area: 'S = (m × n) : 2  (hoặc d₁ × d₂ : 2)',
      vars: {
        'm, n': 'Độ dài hai đường chéo vuông góc',
        a: 'Độ dài một cạnh',
      },
      note: 'Diện tích hình thoi bằng tích độ dài hai đường chéo chia cho 2.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <polygon points="60,10 110,35 60,60 10,35" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <line x1="10" y1="35" x2="110" y2="35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="60" y2="60" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="60" y="31" textAnchor="middle" fontSize="9" fill="#b45309" fontWeight="bold">d₁</text>
          <text x="64" y="50" textAnchor="start" fontSize="9" fill="#6d28d9" fontWeight="bold">d₂</text>
        </svg>
      ),
    },
    {
      name: 'HÌNH TRÒN',
      badge: 'Trọng tâm Lớp 5',
      perimeter: 'C = d × 3,14  (hoặc C = r × 2 × 3,14)',
      area: 'S = r × r × 3,14',
      vars: {
        r: 'Bán kính hình tròn',
        d: 'Đường kính hình tròn (d = 2 × r)',
        '3,14': 'Số pi (π) quy ước trong toán tiểu học',
      },
      note: 'Chu vi bằng đường kính nhân 3,14. Diện tích bằng bán kính nhân bán kính rồi nhân với 3,14.',
      svgPreview: (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-sky-600">
          <circle cx="60" cy="35" r="28" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="60" cy="35" r="2.5" fill="#ef4444" />
          <line x1="60" y1="35" x2="88" y2="35" stroke="#0284c7" strokeWidth="2" />
          <text x="60" y="31" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">O</text>
          <text x="74" y="30" textAnchor="middle" fontSize="9" fill="#0284c7" fontWeight="bold">r</text>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white rounded-2xl p-5 sm:p-6 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Sổ tay hình học lớp 5</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Bảng Tổng Hợp Công Thức & Quy Tắc Tính
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm mt-1">
            Tra cứu nhanh chu vi, diện tích và quy ước chuẩn của tất cả các hình hình học phẳng
          </p>
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-extrabold text-slate-800">{card.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {card.badge}
                </span>
              </div>

              {/* Graphic Diagram */}
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center mb-3">
                {card.svgPreview}
              </div>

              {/* Formulas */}
              <div className="space-y-2">
                {card.perimeter && (
                  <div className="bg-sky-50/80 p-2.5 rounded-xl border border-sky-200">
                    <span className="text-[11px] font-bold uppercase text-sky-900 block">Chu vi:</span>
                    <span className="font-mono text-sm font-black text-sky-800">{card.perimeter}</span>
                  </div>
                )}
                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold uppercase text-emerald-900 block">Diện tích:</span>
                  <span className="font-mono text-sm font-black text-emerald-800">{card.area}</span>
                </div>
              </div>

              {/* Explanation of variables */}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">Trong đó:</span>
                {Object.entries(card.vars).map(([k, v]) => (
                  <div key={k} className="flex gap-1.5 pl-2">
                    <span className="font-bold text-sky-800">{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
              💡 {card.note}
            </div>
          </div>
        ))}
      </div>

      {/* Unit Systems Cheat Sheet */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <h3 className="text-sm font-extrabold uppercase text-slate-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Bảng so sánh quy tắc chuyển đổi đơn vị đo (Mục V & VI)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
            <span className="font-bold text-sky-900 text-sm block mb-1">
              1. Bảng đơn vị đo độ dài:
            </span>
            <p className="text-xs text-slate-700 font-semibold mb-2">
              km ➔ hm ➔ dam ➔ m ➔ dm ➔ cm ➔ mm
            </p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Mỗi đơn vị liền kề gấp hoặc kém nhau <span className="font-bold text-sky-900">10 lần</span>.</li>
              <li>• Ví dụ: 1 m = 10 dm = 100 cm = 1 000 mm.</li>
              <li>• 2,5 m = 250 cm.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="font-bold text-emerald-900 text-sm block mb-1">
              2. Bảng đơn vị đo diện tích:
            </span>
            <p className="text-xs text-slate-700 font-semibold mb-2">
              km² ➔ hm² (ha) ➔ dam² ➔ m² ➔ dm² ➔ cm² ➔ mm²
            </p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Mỗi đơn vị liền kề gấp hoặc kém nhau <span className="font-bold text-emerald-900">100 lần</span>.</li>
              <li>• Ví dụ: 1 m² = 10 000 cm².</li>
              <li>• <span className="font-bold text-emerald-800">1 ha = 10 000 m² = 1 hm²</span>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
