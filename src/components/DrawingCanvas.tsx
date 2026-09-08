import React, { useState, useRef, useEffect } from 'react';
import { ShapeData, Point } from '../types';
import { formatNumberVi } from '../utils/mathUtils';
import {
  Grid,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Undo2,
  Redo2,
  Ruler,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { VirtualRuler } from './VirtualRuler';

interface DrawingCanvasProps {
  shape: ShapeData;
  onChangeShape: (newShape: ShapeData) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onResetDefault?: () => void;
  isPresentationMode?: boolean;
  onTogglePresentation?: () => void;
}

// 1 cm = 32 pixels in SVG coordinate space
const PIXELS_PER_CM = 32;

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  shape,
  onChangeShape,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onResetDefault,
  isPresentationMode = false,
  onTogglePresentation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<string>('👆 Em hãy thử kéo các chấm tròn để thay đổi hình nhé!');

  // Dragging state
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const isPanningRef = useRef<boolean>(false);

  // Auto hint update on shape change
  useEffect(() => {
    if (shape.type === 'rectangle') {
      setActiveHint('👆 Thử kéo điểm B hoặc C để đổi chiều dài và chiều rộng.');
    } else if (shape.type === 'triangle') {
      setActiveHint('📐 Em hãy kéo điểm A, B, C để thay đổi hình tam giác. Bấm vào cạnh để chọn đáy!');
    } else if (shape.type === 'circle') {
      setActiveHint('🔵 Kéo tâm O để di chuyển, kéo điểm M trên đường viền để thay đổi bán kính r.');
    } else if (shape.type === 'square') {
      setActiveHint('🟦 Kéo một đỉnh, hình vuông sẽ tự động co giãn đều 4 cạnh.');
    } else if (shape.type === 'trapezoid') {
      setActiveHint('🟧 Kéo các đỉnh để thay đổi, hai đáy luôn song song với nhau.');
    }
  }, [shape.type]);

  // Center coordinate of SVG viewport
  const viewWidth = 720;
  const viewHeight = 460;
  const cx = viewWidth / 2;
  const cy = viewHeight / 2 + 20;

  // Convert SVG coordinates to real values & vice versa
  // Given shape, compute vertex points in SVG space
  const getShapeCoordinates = (): {
    points: Point[];
    auxiliaryLines?: Array<{ x1: number; y1: number; x2: number; y2: number; dashed?: boolean; color?: string; label?: string }>;
    rightAngleSymbols?: Array<{ x: number; y: number; dirX: number; dirY: number }>;
    center?: { x: number; y: number };
    radiusPx?: number;
  } => {
    const u = shape.unit;

    switch (shape.type) {
      case 'segment': {
        const len = (shape.length ?? 8) * PIXELS_PER_CM;
        const x1 = cx - len / 2;
        const x2 = cx + len / 2;
        const y = cy;
        return {
          points: [
            { id: 'pA', label: 'A', x: x1, y },
            { id: 'pB', label: 'B', x: x2, y },
          ],
        };
      }

      case 'rectangle': {
        const a = (shape.length ?? 8) * PIXELS_PER_CM;
        const b = (shape.width ?? 5) * PIXELS_PER_CM;
        const x1 = cx - a / 2;
        const y1 = cy - b / 2;
        const x2 = cx + a / 2;
        const y2 = cy + b / 2;
        return {
          points: [
            { id: 'pA', label: 'A', x: x1, y: y1 },
            { id: 'pB', label: 'B', x: x2, y: y1 },
            { id: 'pC', label: 'C', x: x2, y: y2 },
            { id: 'pD', label: 'D', x: x1, y: y2 },
          ],
          rightAngleSymbols: [
            { x: x1, y: y1, dirX: 1, dirY: 1 },
            { x: x2, y: y1, dirX: -1, dirY: 1 },
            { x: x2, y: y2, dirX: -1, dirY: -1 },
            { x: x1, y: y2, dirX: 1, dirY: -1 },
          ],
        };
      }

      case 'square': {
        const a = (shape.side ?? 6) * PIXELS_PER_CM;
        const x1 = cx - a / 2;
        const y1 = cy - a / 2;
        const x2 = cx + a / 2;
        const y2 = cy + a / 2;
        return {
          points: [
            { id: 'pA', label: 'A', x: x1, y: y1 },
            { id: 'pB', label: 'B', x: x2, y: y1 },
            { id: 'pC', label: 'C', x: x2, y: y2 },
            { id: 'pD', label: 'D', x: x1, y: y2 },
          ],
          rightAngleSymbols: [
            { x: x1, y: y1, dirX: 1, dirY: 1 },
            { x: x2, y: y1, dirX: -1, dirY: 1 },
            { x: x2, y: y2, dirX: -1, dirY: -1 },
            { x: x1, y: y2, dirX: 1, dirY: -1 },
          ],
        };
      }

      case 'triangle': {
        const a = (shape.baseA ?? 10) * PIXELS_PER_CM;
        const h = (shape.height ?? 6) * PIXELS_PER_CM;
        // Base BC
        const bx = cx - a / 2;
        const by = cy + h / 2;
        const cx_point = cx + a / 2;
        const cy_point = cy + h / 2;
        // Apex A
        const ax = cx - a / 6; // slightly asymmetric for natural look
        const ay = cy - h / 2;

        // Altitude foot H on BC: (ax, by)
        const aux = [
          {
            x1: ax,
            y1: ay,
            x2: ax,
            y2: by,
            dashed: true,
            color: '#0284c7', // blue altitude
            label: `h = ${formatNumberVi(shape.height ?? 6)} ${u}`,
          },
        ];

        return {
          points: [
            { id: 'pA', label: 'A', x: ax, y: ay },
            { id: 'pB', label: 'B', x: bx, y: by },
            { id: 'pC', label: 'C', x: cx_point, y: cy_point },
          ],
          auxiliaryLines: aux,
          rightAngleSymbols: [{ x: ax, y: by, dirX: 1, dirY: -1 }],
        };
      }

      case 'right_triangle': {
        const a = (shape.baseA ?? 8) * PIXELS_PER_CM; // bottom leg
        const b = (shape.height ?? 6) * PIXELS_PER_CM; // vertical leg
        const xA = cx - a / 2;
        const yA = cy - b / 2;
        const xB = cx - a / 2;
        const yB = cy + b / 2;
        const xC = cx + a / 2;
        const yC = cy + b / 2;

        return {
          points: [
            { id: 'pA', label: 'A', x: xA, y: yA },
            { id: 'pB', label: 'B', x: xB, y: yB },
            { id: 'pC', label: 'C', x: xC, y: yC },
          ],
          rightAngleSymbols: [{ x: xB, y: yB, dirX: 1, dirY: -1 }],
        };
      }

      case 'parallelogram': {
        const a = (shape.baseA ?? 9) * PIXELS_PER_CM;
        const h = (shape.height ?? 5) * PIXELS_PER_CM;
        const slant = 40;
        const xA = cx - a / 2 + slant;
        const yA = cy - h / 2;
        const xB = cx + a / 2 + slant;
        const yB = cy - h / 2;
        const xC = cx + a / 2 - slant;
        const yC = cy + h / 2;
        const xD = cx - a / 2 - slant;
        const yD = cy + h / 2;

        return {
          points: [
            { id: 'pA', label: 'A', x: xA, y: yA },
            { id: 'pB', label: 'B', x: xB, y: yB },
            { id: 'pC', label: 'C', x: xC, y: yC },
            { id: 'pD', label: 'D', x: xD, y: yD },
          ],
          auxiliaryLines: [
            {
              x1: xA,
              y1: yA,
              x2: xA,
              y2: yD,
              dashed: true,
              color: '#0284c7',
              label: `h = ${formatNumberVi(shape.height ?? 5)} ${u}`,
            },
          ],
          rightAngleSymbols: [{ x: xA, y: yD, dirX: 1, dirY: -1 }],
        };
      }

      case 'rhombus': {
        const d1 = (shape.diagonal1 ?? 8) * PIXELS_PER_CM;
        const d2 = (shape.diagonal2 ?? 6) * PIXELS_PER_CM;
        const xA = cx;
        const yA = cy - d2 / 2;
        const xB = cx + d1 / 2;
        const yB = cy;
        const xC = cx;
        const yC = cy + d2 / 2;
        const xD = cx - d1 / 2;
        const yD = cy;

        return {
          points: [
            { id: 'pA', label: 'A', x: xA, y: yA },
            { id: 'pB', label: 'B', x: xB, y: yB },
            { id: 'pC', label: 'C', x: xC, y: yC },
            { id: 'pD', label: 'D', x: xD, y: yD },
          ],
          auxiliaryLines: [
            { x1: xD, y1: yD, x2: xB, y2: yB, dashed: true, color: '#f59e0b', label: `d₁ = ${formatNumberVi(shape.diagonal1 ?? 8)} ${u}` },
            { x1: xA, y1: yA, x2: xC, y2: yC, dashed: true, color: '#8b5cf6', label: `d₂ = ${formatNumberVi(shape.diagonal2 ?? 6)} ${u}` },
          ],
          rightAngleSymbols: [{ x: cx, y: cy, dirX: 1, dirY: -1 }],
        };
      }

      case 'trapezoid': {
        const a = (shape.baseA ?? 12) * PIXELS_PER_CM; // bottom base
        const b = (shape.baseB ?? 8) * PIXELS_PER_CM;  // top base
        const h = (shape.height ?? 5) * PIXELS_PER_CM;

        const xA = cx - b / 2;
        const yA = cy - h / 2;
        const xB = cx + b / 2;
        const yB = cy - h / 2;
        const xC = cx + a / 2;
        const yC = cy + h / 2;
        const xD = cx - a / 2;
        const yD = cy + h / 2;

        return {
          points: [
            { id: 'pA', label: 'A', x: xA, y: yA },
            { id: 'pB', label: 'B', x: xB, y: yB },
            { id: 'pC', label: 'C', x: xC, y: yC },
            { id: 'pD', label: 'D', x: xD, y: yD },
          ],
          auxiliaryLines: [
            {
              x1: xA,
              y1: yA,
              x2: xA,
              y2: yD,
              dashed: true,
              color: '#0284c7',
              label: `h = ${formatNumberVi(shape.height ?? 5)} ${u}`,
            },
          ],
          rightAngleSymbols: [{ x: xA, y: yD, dirX: 1, dirY: -1 }],
        };
      }

      case 'circle': {
        const rVal = shape.circleInputMode === 'diameter' && shape.diameter ? shape.diameter / 2 : (shape.radius ?? 5);
        const rPx = rVal * PIXELS_PER_CM;
        return {
          points: [
            { id: 'pO', label: 'O', x: cx, y: cy },
            { id: 'pM', label: 'M', x: cx + rPx, y: cy },
          ],
          center: { x: cx, y: cy },
          radiusPx: rPx,
          auxiliaryLines: [
            {
              x1: cx - rPx,
              y1: cy,
              x2: cx + rPx,
              y2: cy,
              dashed: true,
              color: '#ef4444',
              label: `d = ${formatNumberVi(rVal * 2)} ${u}`,
            },
            {
              x1: cx,
              y1: cy,
              x2: cx + rPx * Math.cos(Math.PI / 4),
              y2: cy - rPx * Math.sin(Math.PI / 4),
              dashed: false,
              color: '#0284c7',
              label: `r = ${formatNumberVi(rVal)} ${u}`,
            },
          ],
        };
      }

      case 'semicircle': {
        const rVal = shape.radius ?? 5;
        const rPx = rVal * PIXELS_PER_CM;
        return {
          points: [
            { id: 'pO', label: 'O', x: cx, y: cy + 40 },
            { id: 'pM', label: 'M', x: cx + rPx, y: cy + 40 },
          ],
          center: { x: cx, y: cy + 40 },
          radiusPx: rPx,
          auxiliaryLines: [
            {
              x1: cx,
              y1: cy + 40,
              x2: cx,
              y2: cy + 40 - rPx,
              dashed: true,
              color: '#0284c7',
              label: `r = ${formatNumberVi(rVal)} ${u}`,
            },
          ],
        };
      }

      case 'compound': {
        // Compound: Rectangle 10 x 6 + triangle on top (base 10, height 4)
        const a = (shape.length ?? 10) * PIXELS_PER_CM;
        const b = (shape.width ?? 6) * PIXELS_PER_CM;
        const h = (shape.height ?? 4) * PIXELS_PER_CM;

        const xA = cx - a / 2;
        const yA = cy - b / 2 + 30;
        const xB = cx + a / 2;
        const yB = cy - b / 2 + 30;
        const xC = cx + a / 2;
        const yC = cy + b / 2 + 30;
        const xD = cx - a / 2;
        const yD = cy + b / 2 + 30;
        const xE = cx; // apex
        const yE = yA - h;

        return {
          points: [
            { id: 'pE', label: 'E (Đỉnh mái)', x: xE, y: yE },
            { id: 'pA', label: 'A', x: xA, y: yA },
            { id: 'pB', label: 'B', x: xB, y: yB },
            { id: 'pC', label: 'C', x: xC, y: yC },
            { id: 'pD', label: 'D', x: xD, y: yD },
          ],
          auxiliaryLines: [
            { x1: xA, y1: yA, x2: xB, y2: yB, dashed: true, color: '#64748b', label: 'Đường phân chia' },
            { x1: xE, y1: yE, x2: xE, y2: yA, dashed: true, color: '#0284c7', label: `h = ${formatNumberVi(shape.height ?? 4)} ${u}` },
          ],
        };
      }

      default:
        return { points: [] };
    }
  };

  const { points, auxiliaryLines, rightAngleSymbols, center, radiusPx } = getShapeCoordinates();

  // Pointer drag handler for vertices
  const handlePointerDownPoint = (e: React.PointerEvent, pointId: string) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingPointId(pointId);
    dragStartPosRef.current = { clientX: e.clientX, clientY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanningRef.current && dragStartPosRef.current) {
      const dx = e.clientX - dragStartPosRef.current.clientX;
      const dy = e.clientY - dragStartPosRef.current.clientY;
      dragStartPosRef.current = { clientX: e.clientX, clientY: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (!draggingPointId || !dragStartPosRef.current) return;

    const dx = (e.clientX - dragStartPosRef.current.clientX) / (zoom * PIXELS_PER_CM);
    const dy = (e.clientY - dragStartPosRef.current.clientY) / (zoom * PIXELS_PER_CM);

    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return;

    const newShape = { ...shape };

    // Update geometry based on shape constraints
    if (shape.type === 'rectangle') {
      if (draggingPointId === 'pB' || draggingPointId === 'pC') {
        const curLen = shape.length ?? 8;
        newShape.length = Math.max(2, Math.min(18, Math.round((curLen + dx * 2) * 10) / 10));
      }
      if (draggingPointId === 'pC' || draggingPointId === 'pD') {
        const curW = shape.width ?? 5;
        newShape.width = Math.max(2, Math.min(12, Math.round((curW + dy * 2) * 10) / 10));
      }
    } else if (shape.type === 'square') {
      const curSide = shape.side ?? 6;
      // Change side proportionally
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      newShape.side = Math.max(2, Math.min(12, Math.round((curSide + delta * 1.5) * 10) / 10));
    } else if (shape.type === 'triangle' || shape.type === 'right_triangle') {
      if (draggingPointId === 'pA') {
        const curH = shape.height ?? 6;
        newShape.height = Math.max(2, Math.min(12, Math.round((curH - dy * 1.5) * 10) / 10));
      } else if (draggingPointId === 'pC' || draggingPointId === 'pB') {
        const curA = shape.baseA ?? 10;
        newShape.baseA = Math.max(3, Math.min(18, Math.round((curA + (draggingPointId === 'pC' ? dx : -dx) * 2) * 10) / 10));
      }
    } else if (shape.type === 'circle' || shape.type === 'semicircle') {
      if (draggingPointId === 'pM') {
        const curR = shape.radius ?? 5;
        const newR = Math.max(1.5, Math.min(9, Math.round((curR + dx) * 10) / 10));
        newShape.radius = newR;
        newShape.diameter = newR * 2;
      }
    } else if (shape.type === 'trapezoid') {
      if (draggingPointId === 'pA' || draggingPointId === 'pB') {
        const curB = shape.baseB ?? 8;
        newShape.baseB = Math.max(2, Math.min(14, Math.round((curB + (draggingPointId === 'pB' ? dx : -dx) * 2) * 10) / 10));
      } else if (draggingPointId === 'pC' || draggingPointId === 'pD') {
        const curA = shape.baseA ?? 12;
        newShape.baseA = Math.max(4, Math.min(18, Math.round((curA + (draggingPointId === 'pC' ? dx : -dx) * 2) * 10) / 10));
      }
    } else if (shape.type === 'rhombus') {
      if (draggingPointId === 'pB' || draggingPointId === 'pD') {
        const curD1 = shape.diagonal1 ?? 8;
        newShape.diagonal1 = Math.max(3, Math.min(16, Math.round((curD1 + dx * 2) * 10) / 10));
      } else if (draggingPointId === 'pA' || draggingPointId === 'pC') {
        const curD2 = shape.diagonal2 ?? 6;
        newShape.diagonal2 = Math.max(2, Math.min(12, Math.round((curD2 + (draggingPointId === 'pC' ? dy : -dy) * 2) * 10) / 10));
      }
    } else if (shape.type === 'parallelogram') {
      if (draggingPointId === 'pB' || draggingPointId === 'pC') {
        const curA = shape.baseA ?? 9;
        newShape.baseA = Math.max(3, Math.min(16, Math.round((curA + dx * 1.5) * 10) / 10));
      }
      if (draggingPointId === 'pA' || draggingPointId === 'pB') {
        const curH = shape.height ?? 5;
        newShape.height = Math.max(2, Math.min(10, Math.round((curH - dy) * 10) / 10));
      }
    }

    dragStartPosRef.current = { clientX: e.clientX, clientY: e.clientY };
    onChangeShape(newShape);
  };

  const handlePointerUp = () => {
    setDraggingPointId(null);
    dragStartPosRef.current = null;
    isPanningRef.current = false;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'grid-bg') {
      isPanningRef.current = true;
      dragStartPosRef.current = { clientX: e.clientX, clientY: e.clientY };
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Build SVG polygon points
  const polygonPointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden select-none transition-all ${isPresentationMode ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full'}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border-b border-sky-100">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Bảng vẽ tương tác SVG
          </span>

          {/* Undo / Redo */}
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition"
            title="Hoàn tác (Undo)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition"
            title="Làm lại (Redo)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onResetDefault}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition"
            title="Đặt lại hình gốc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Toggle Grid */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${showGrid ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            title="Bật / tắt lưới ô vuông"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưới</span>
          </button>

          {/* Toggle Guidelines */}
          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${showGuidelines ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            title="Bật / tắt đường gióng chiều cao"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đường gióng</span>
          </button>

          {/* Toggle Labels */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${showLabels ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            title="Bật / tắt tên điểm A, B, C..."
          >
            {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Tên điểm</span>
          </button>

          {/* Toggle Dimensions */}
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${showDimensions ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            title="Bật / tắt hiển thị số đo"
          >
            <span className="font-mono text-xs">123</span>
            <span className="hidden sm:inline">Số đo</span>
          </button>

          {/* Virtual Ruler button */}
          <button
            type="button"
            onClick={() => setShowRuler(!showRuler)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${showRuler ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}
            title="Thước đo ảo cm"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Thước</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold px-1 min-w-8 text-center text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center & Fullscreen Presentation */}
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
            title="Căn giữa hình"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onTogglePresentation && (
            <button
              type="button"
              onClick={onTogglePresentation}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${isPresentationMode ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-sky-50 text-sky-700 border-sky-300'}`}
              title="Chế độ trình chiếu toàn màn hình"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trình chiếu</span>
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-[380px] sm:h-[440px] md:h-[480px] bg-slate-50/50 cursor-crosshair overflow-hidden touch-none"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Helper Banner */}
        <div className="absolute top-2 left-3 right-3 z-10 pointer-events-none flex justify-center">
          <div className="bg-sky-900/80 backdrop-blur-xs text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-md animate-fade-in font-medium flex items-center gap-2">
            <span>{activeHint}</span>
          </div>
        </div>

        {/* Virtual Ruler */}
        {showRuler && (
          <VirtualRuler
            onClose={() => setShowRuler(false)}
            scalePixelsPerCm={PIXELS_PER_CM * zoom}
          />
        )}

        {/* Main SVG Render */}
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-pattern" width={PIXELS_PER_CM} height={PIXELS_PER_CM} patternUnits="userSpaceOnUse">
              <path
                d={`M ${PIXELS_PER_CM} 0 L 0 0 0 ${PIXELS_PER_CM}`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.2" fill="#cbd5e1" />
            </pattern>

            {/* Subtle Gradient for Shape Interior */}
            <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.14" />
            </linearGradient>

            <linearGradient id="compoundTriGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="compoundRectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Transform group for Pan and Zoom */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            {/* Background Grid */}
            {showGrid && (
              <rect
                id="grid-bg"
                x="-1000"
                y="-1000"
                width="3000"
                height="3000"
                fill="url(#grid-pattern)"
              />
            )}

            {/* SHAPE RENDERING */}
            {shape.type === 'segment' && points.length === 2 && (
              <line
                x1={points[0].x}
                y1={points[0].y}
                x2={points[1].x}
                y2={points[1].y}
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {shape.type === 'circle' && center && radiusPx && (
              <circle
                cx={center.x}
                cy={center.y}
                r={radiusPx}
                fill="url(#shapeGradient)"
                stroke="#0284c7"
                strokeWidth="3.5"
              />
            )}

            {shape.type === 'semicircle' && center && radiusPx && (
              <path
                d={`M ${center.x - radiusPx} ${center.y} A ${radiusPx} ${radiusPx} 0 0 1 ${center.x + radiusPx} ${center.y} Z`}
                fill="url(#shapeGradient)"
                stroke="#0284c7"
                strokeWidth="3.5"
              />
            )}

            {shape.type === 'compound' && points.length >= 5 && (
              <g>
                {/* Rectangular Part */}
                <polygon
                  points={`${points[1].x},${points[1].y} ${points[2].x},${points[2].y} ${points[3].x},${points[3].y} ${points[4].x},${points[4].y}`}
                  fill="url(#compoundRectGradient)"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                {/* Triangular Part */}
                <polygon
                  points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`}
                  fill="url(#compoundTriGradient)"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
              </g>
            )}

            {shape.type !== 'segment' && shape.type !== 'circle' && shape.type !== 'semicircle' && shape.type !== 'compound' && (
              <polygon
                points={polygonPointsStr}
                fill="url(#shapeGradient)"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            )}

            {/* Auxiliary Lines (Altitudes, Diagonals, Diameters) */}
            {showGuidelines && auxiliaryLines && auxiliaryLines.map((line, idx) => (
              <g key={`aux-${idx}`}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.color || '#0284c7'}
                  strokeWidth="2.5"
                  strokeDasharray={line.dashed ? '6 4' : undefined}
                />
                {showDimensions && line.label && (
                  <g transform={`translate(${(line.x1 + line.x2) / 2 + 10}, ${(line.y1 + line.y2) / 2})`}>
                    <rect
                      x="-6"
                      y="-12"
                      width={line.label.length * 7.5 + 12}
                      height="20"
                      rx="6"
                      fill="#ffffff"
                      stroke={line.color || '#0284c7'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="2"
                      fill="#0f172a"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Quicksand, sans-serif"
                    >
                      {line.label}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {/* Right Angle Symbols */}
            {showGuidelines && rightAngleSymbols && rightAngleSymbols.map((ra, idx) => {
              const size = 12;
              const x1 = ra.x + ra.dirX * size;
              const y1 = ra.y;
              const x2 = ra.x + ra.dirX * size;
              const y2 = ra.y + ra.dirY * size;
              const x3 = ra.x;
              const y3 = ra.y + ra.dirY * size;
              return (
                <polyline
                  key={`ra-${idx}`}
                  points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
              );
            })}

            {/* Side Dimension Labels on polygon sides */}
            {showDimensions && points.length > 1 && shape.type !== 'circle' && shape.type !== 'semicircle' && shape.type !== 'compound' && (
              <g>
                {points.map((p, idx) => {
                  const nextP = points[(idx + 1) % points.length];
                  if (shape.type === 'segment' && idx > 0) return null;

                  const midX = (p.x + nextP.x) / 2;
                  const midY = (p.y + nextP.y) / 2;

                  // Compute dimension text
                  let label = '';
                  const u = shape.unit;

                  if (shape.type === 'rectangle') {
                    if (idx === 0 || idx === 2) label = `${formatNumberVi(shape.length ?? 8)} ${u}`;
                    if (idx === 1 || idx === 3) label = `${formatNumberVi(shape.width ?? 5)} ${u}`;
                  } else if (shape.type === 'square') {
                    label = `${formatNumberVi(shape.side ?? 6)} ${u}`;
                  } else if (shape.type === 'triangle' || shape.type === 'right_triangle') {
                    if (idx === 1) label = `Đáy a = ${formatNumberVi(shape.baseA ?? 10)} ${u}`;
                  } else if (shape.type === 'trapezoid') {
                    if (idx === 0) label = `Đáy bé b = ${formatNumberVi(shape.baseB ?? 8)} ${u}`;
                    if (idx === 2) label = `Đáy lớn a = ${formatNumberVi(shape.baseA ?? 12)} ${u}`;
                  } else if (shape.type === 'parallelogram') {
                    if (idx === 0 || idx === 2) label = `a = ${formatNumberVi(shape.baseA ?? 9)} ${u}`;
                  } else if (shape.type === 'rhombus') {
                    label = `cạnh = ${formatNumberVi(shape.side ?? 5)} ${u}`;
                  } else if (shape.type === 'segment') {
                    label = `AB = ${formatNumberVi(shape.length ?? 8)} ${u}`;
                  }

                  if (!label) return null;

                  // Compute slight normal offset to prevent overlapping edge
                  const dx = nextP.x - p.x;
                  const dy = nextP.y - p.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const nx = -dy / len;
                  const ny = dx / len;
                  const offsetX = midX + nx * 18;
                  const offsetY = midY + ny * 18;

                  return (
                    <g key={`dim-${idx}`} transform={`translate(${offsetX}, ${offsetY})`}>
                      <rect
                        x="-30"
                        y="-11"
                        width="60"
                        height="20"
                        rx="6"
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Quicksand, sans-serif"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Interactive Control Vertices (Drag Handles) */}
            {points.map((p) => {
              const isDragging = draggingPointId === p.id;
              return (
                <g
                  key={`point-${p.id}`}
                  transform={`translate(${p.x}, ${p.y})`}
                  className="cursor-pointer"
                  onPointerDown={(e) => handlePointerDownPoint(e, p.id)}
                >
                  {/* Invisible generous touch target (r=24 -> 48px hit area) */}
                  <circle cx="0" cy="0" r="24" fill="transparent" />

                  {/* Outer Pulsing Aura when dragging */}
                  {isDragging && (
                    <circle cx="0" cy="0" r="18" fill="#38bdf8" fillOpacity="0.4" className="animate-ping" />
                  )}

                  {/* Visible Handle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isDragging ? 11 : 9}
                    fill={p.id === 'pO' ? '#ef4444' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    className="transition-all hover:scale-125"
                  />

                  {/* Point Label badge */}
                  {showLabels && (
                    <g transform="translate(14, -14)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="800"
                        fontFamily="Quicksand, sans-serif"
                      >
                        {p.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom Quick Help Info */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
            Chấm tròn màu xanh: Kéo thả đỉnh hình
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            Chấm đỏ: Tâm hình tròn (O)
          </span>
        </div>
        <div className="font-semibold text-sky-700">
          Tỉ lệ: 1 cm = 32 pixel SVG
        </div>
      </div>
    </div>
  );
};
