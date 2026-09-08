import React, { useState, useRef } from 'react';
import { RotateCw, X } from 'lucide-react';

interface VirtualRulerProps {
  onClose: () => void;
  scalePixelsPerCm: number;
}

export const VirtualRuler: React.FC<VirtualRulerProps> = ({ onClose, scalePixelsPerCm }) => {
  const [position, setPosition] = useState({ x: 80, y: 350 });
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  const rulerLengthCm = 15;
  const rulerWidthPx = rulerLengthCm * scalePixelsPerCm;
  const rulerHeightPx = 54;

  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicked on rotation button or close, don't drag
    if ((e.target as HTMLElement).closest('.no-drag-ruler')) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPosition({
      x: Math.max(10, Math.min(800, dragStartRef.current.startX + dx)),
      y: Math.max(10, Math.min(600, dragStartRef.current.startY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const rotateRuler = (delta: number) => {
    setAngle((prev) => (prev + delta + 360) % 360);
  };

  return (
    <div
      className="absolute select-none z-30 touch-none shadow-xl rounded-md transition-shadow cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '20px 20px',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title="Kéo để di chuyển thước, bấm nút xoay để đổi hướng đo"
    >
      {/* Ruler body: semi-transparent acrylic look with amber/cyan markings */}
      <div
        className="relative bg-amber-50/95 border-2 border-amber-400/80 rounded-md backdrop-blur-xs flex flex-col justify-between shadow-lg"
        style={{ width: `${rulerWidthPx + 30}px`, height: `${rulerHeightPx}px` }}
      >
        {/* Close & Rotate actions */}
        <div className="absolute top-1 right-1 flex items-center gap-1 no-drag-ruler">
          <button
            type="button"
            onClick={() => rotateRuler(15)}
            className="p-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors shadow-xs"
            title="Xoay thước +15°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-rose-200 hover:bg-rose-300 text-rose-800 transition-colors shadow-xs"
            title="Đóng thước"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Graduation Marks */}
        <div className="relative w-full h-7 border-b border-amber-300/60 overflow-hidden">
          {Array.from({ length: rulerLengthCm * 10 + 1 }).map((_, idx) => {
            const cm = idx / 10;
            const isCm = idx % 10 === 0;
            const isHalfCm = idx % 5 === 0 && !isCm;
            const xPos = 15 + cm * scalePixelsPerCm;
            const markHeight = isCm ? 18 : isHalfCm ? 12 : 7;

            return (
              <React.Fragment key={idx}>
                <div
                  className="absolute bottom-0 bg-slate-800"
                  style={{
                    left: `${xPos}px`,
                    width: isCm ? '1.5px' : '1px',
                    height: `${markHeight}px`,
                  }}
                />
                {isCm && (
                  <span
                    className="absolute font-bold text-[10px] text-slate-800 -translate-x-1/2"
                    style={{ left: `${xPos}px`, top: '2px' }}
                  >
                    {cm}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Ruler Info Label */}
        <div className="px-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-amber-900/80">
          <span>📏 Thước đo (cm)</span>
          <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">
            {angle}°
          </span>
        </div>
      </div>
    </div>
  );
};
