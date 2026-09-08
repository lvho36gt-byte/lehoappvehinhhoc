export type LengthUnit = 'mm' | 'cm' | 'dm' | 'm' | 'dam' | 'hm' | 'km';
export type AreaUnit = 'mm²' | 'cm²' | 'dm²' | 'm²' | 'dam²' | 'hm²' | 'ha' | 'km²';

export type ShapeType =
  | 'segment'
  | 'rectangle'
  | 'square'
  | 'triangle'
  | 'right_triangle'
  | 'parallelogram'
  | 'rhombus'
  | 'trapezoid'
  | 'circle'
  | 'semicircle'
  | 'compound';

export interface Point {
  id: string;
  label: string;
  x: number;
  y: number;
  isFixed?: boolean;
}

export interface ShapeData {
  type: ShapeType;
  name: string;
  points: Point[];
  unit: LengthUnit;
  // Specific parameters in real unit
  length?: number;     // a (or length)
  width?: number;      // b (or width)
  side?: number;       // a (square or rhombus)
  baseA?: number;      // bottom base
  baseB?: number;      // top base (trapezoid)
  height?: number;     // h
  radius?: number;     // r
  diameter?: number;   // d
  diagonal1?: number;  // d1
  diagonal2?: number;  // d2
  sideA?: number;
  sideB?: number;
  sideC?: number;
  activeBaseIndex?: number; // 0: BC, 1: CA, 2: AB for triangle
  circleInputMode?: 'radius' | 'diameter';
  showVerticesLabels?: boolean;
  showDimensions?: boolean;
  showAltitude?: boolean;
}

export interface CanvasDisplayOptions {
  showGrid: boolean;
  showDimensions: boolean;
  showVerticesLabels?: boolean;
  showAngles?: boolean;
  snapToGrid?: boolean;
}

export interface CalculationResult {
  perimeter: number;
  perimeterFormula: string;
  perimeterSteps: string;
  perimeterUnit: LengthUnit;
  
  area: number;
  areaFormula: string;
  areaSteps: string;
  areaUnit: AreaUnit;

  extraNotes?: string[];
}

export interface Exercise {
  id: string;
  title: string;
  topic: string;
  level: 1 | 2 | 3 | 4; // 1: Nhận biết, 2: Thông hiểu, 3: Vận dụng, 4: Thử thách
  prompt: string;
  shapeType: ShapeType;
  defaultData: Partial<ShapeData>;
  givenDataText: string;
  targetQuestion: string;
  questionType: 'area' | 'perimeter' | 'side' | 'height' | 'base' | 'radius' | 'diameter' | 'compound' | 'unit_conversion';
  correctValue: number;
  correctUnit: LengthUnit | AreaUnit;
  expectedFormula: string;
  formulaOptions: string[];
  unitOptions: (LengthUnit | AreaUnit)[];
  hints: [string, string, string]; // Hint 1, 2, 3
  explanation: string;
  stepGuide: {
    summary: { [key: string]: string };
    formula: string;
    calculation: string;
    answer: string;
  };
}

export interface UserStats {
  points: number;
  streak: number;
  completedExercises: number;
  correctCount: number;
  wrongCount: number;
  earnedBadges: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface ExtractedProblem {
  id: string;
  title: string;
  originalPrompt: string;
  shapeType: ShapeType;
  shapeParams: {
    unit: LengthUnit;
    length?: number;
    width?: number;
    side?: number;
    baseA?: number;
    baseB?: number;
    height?: number;
    radius?: number;
    diameter?: number;
    diagonal1?: number;
    diagonal2?: number;
    showAltitude?: boolean;
  };
  summary: {
    given: string[];
    target: string;
  };
  solutionSteps: {
    stepNumber: number;
    title: string;
    formulaExplanation?: string;
    calculation: string;
    resultNote?: string;
  }[];
  finalAnswer: string;
  targetQuestionType?: string;
  pedagogicalNote?: string;
}

export type AppTab = 'draw' | 'ai_solve' | 'explore' | 'calculate' | 'practice' | 'challenge' | 'handbook';
