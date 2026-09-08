import { LengthUnit, AreaUnit, ShapeData, CalculationResult } from '../types';

export const LENGTH_FACTORS_TO_METERS: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  dam: 10,
  hm: 100,
  km: 1000,
};

export const AREA_FACTORS_TO_SQ_METERS: Record<AreaUnit, number> = {
  'mm²': 0.000001,
  'cm²': 0.0001,
  'dm²': 0.01,
  'm²': 1,
  'dam²': 100,
  'hm²': 10000,
  ha: 10000,
  'km²': 1000000,
};

export const LENGTH_UNITS: LengthUnit[] = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'];
export const AREA_UNITS: AreaUnit[] = ['mm²', 'cm²', 'dm²', 'm²', 'dam²', 'hm²', 'ha', 'km²'];

/**
 * Format a number using Vietnamese standard:
 * Uses comma `,` for decimal point, space for thousands.
 * e.g. 10000 -> 10 000, 2.5 -> 2,5
 */
export function formatNumberVi(value: number, maxDecimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  // Round to maxDecimals cleanly to avoid float artifacts (like 78.50000000001)
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round(value * factor) / factor;
  
  const parts = rounded.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length > 1) {
    const decimalPart = parts[1].replace(/0+$/, ''); // trim trailing zeros
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
  }
  return integerPart;
}

/**
 * Parses user input string which can be "2,5", "2.5", "  10 000  "
 */
export function parseNumberVi(input: string | number): number {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  // replace comma with dot, remove spaces
  const clean = input.toString().replace(/\s+/g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Converts length between units
 */
export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const inMeters = value * LENGTH_FACTORS_TO_METERS[from];
  return inMeters / LENGTH_FACTORS_TO_METERS[to];
}

/**
 * Converts area between units
 */
export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const inSqMeters = value * AREA_FACTORS_TO_SQ_METERS[from];
  return inSqMeters / AREA_FACTORS_TO_SQ_METERS[to];
}

/**
 * Maps length unit to corresponding area unit (e.g. cm -> cm², m -> m²)
 */
export function getAreaUnitForLength(unit: LengthUnit): AreaUnit {
  switch (unit) {
    case 'mm': return 'mm²';
    case 'cm': return 'cm²';
    case 'dm': return 'dm²';
    case 'm': return 'm²';
    case 'dam': return 'dam²';
    case 'hm': return 'hm²';
    case 'km': return 'km²';
    default: return 'cm²';
  }
}

/**
 * Pure deterministic calculation for all Grade 5 geometry shapes
 */
export function calculateShape(shape: ShapeData): CalculationResult {
  const unit = shape.unit || 'cm';
  const areaUnit = getAreaUnitForLength(unit);
  const u = unit;
  const au = areaUnit;

  switch (shape.type) {
    case 'segment': {
      const len = shape.length ?? 8;
      return {
        perimeter: len,
        perimeterFormula: 'Độ dài đoạn thẳng AB = a',
        perimeterSteps: `AB = ${formatNumberVi(len)} ${u}`,
        perimeterUnit: u,
        area: 0,
        areaFormula: 'Đoạn thẳng không có diện tích',
        areaSteps: '0 ' + au,
        areaUnit: au,
      };
    }

    case 'rectangle': {
      const a = Math.max(0.1, shape.length ?? 8);
      const b = Math.max(0.1, shape.width ?? 5);
      const P = (a + b) * 2;
      const S = a * b;

      return {
        perimeter: P,
        perimeterFormula: 'P = (a + b) × 2',
        perimeterSteps: `P = (${formatNumberVi(a)} + ${formatNumberVi(b)}) × 2 = ${formatNumberVi(a + b)} × 2 = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = a × b',
        areaSteps: `S = ${formatNumberVi(a)} × ${formatNumberVi(b)} = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là chiều dài, b là chiều rộng (cùng một đơn vị đo).',
          'Chu vi bằng tổng chiều dài và chiều rộng nhân với 2.',
          'Diện tích bằng chiều dài nhân với chiều rộng.',
        ],
      };
    }

    case 'square': {
      const a = Math.max(0.1, shape.side ?? 6);
      const P = a * 4;
      const S = a * a;

      return {
        perimeter: P,
        perimeterFormula: 'P = a × 4',
        perimeterSteps: `P = ${formatNumberVi(a)} × 4 = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = a × a',
        areaSteps: `S = ${formatNumberVi(a)} × ${formatNumberVi(a)} = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là độ dài một cạnh của hình vuông.',
          'Chu vi hình vuông bằng độ dài một cạnh nhân với 4.',
          'Diện tích hình vuông bằng độ dài một cạnh nhân với chính nó.',
        ],
      };
    }

    case 'triangle':
    case 'right_triangle': {
      const a = Math.max(0.1, shape.baseA ?? 10);
      const h = Math.max(0.1, shape.height ?? 6);
      const sideB = shape.sideB ?? Math.round(Math.sqrt(h * h + 4) * 10) / 10;
      const sideC = shape.sideC ?? Math.round(Math.sqrt(h * h + (a - 2) * (a - 2)) * 10) / 10;
      
      const P = a + sideB + sideC;
      const S = (a * h) / 2;

      return {
        perimeter: P,
        perimeterFormula: 'P = a + b + c (tổng độ dài 3 cạnh)',
        perimeterSteps: `P = ${formatNumberVi(a)} + ${formatNumberVi(sideB)} + ${formatNumberVi(sideC)} = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = a × h : 2',
        areaSteps: `S = (${formatNumberVi(a)} × ${formatNumberVi(h)}) : 2 = ${formatNumberVi(a * h)} : 2 = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là độ dài đáy, h là chiều cao tương ứng với đáy đó.',
          'Muốn tính diện tích hình tam giác ta lấy độ dài đáy nhân với chiều cao (cùng đơn vị đo) rồi chia cho 2.',
          shape.type === 'right_triangle' ? 'Với tam giác vuông: S = (hai cạnh góc vuông nhân với nhau) : 2' : '',
        ].filter(Boolean),
      };
    }

    case 'parallelogram': {
      const a = Math.max(0.1, shape.baseA ?? 9);
      const h = Math.max(0.1, shape.height ?? 5);
      const sideB = shape.sideB ?? 6;
      const P = (a + sideB) * 2;
      const S = a * h;

      return {
        perimeter: P,
        perimeterFormula: 'P = (a + b) × 2',
        perimeterSteps: `P = (${formatNumberVi(a)} + ${formatNumberVi(sideB)}) × 2 = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = a × h',
        areaSteps: `S = ${formatNumberVi(a)} × ${formatNumberVi(h)} = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là độ dài đáy, h là chiều cao tương ứng, b là cạnh bên.',
          'Diện tích hình bình hành bằng độ dài đáy nhân với chiều cao.',
        ],
      };
    }

    case 'rhombus': {
      const a = Math.max(0.1, shape.side ?? 5);
      const d1 = Math.max(0.1, shape.diagonal1 ?? 8);
      const d2 = Math.max(0.1, shape.diagonal2 ?? 6);
      const P = a * 4;
      const S = (d1 * d2) / 2;

      return {
        perimeter: P,
        perimeterFormula: 'P = a × 4',
        perimeterSteps: `P = ${formatNumberVi(a)} × 4 = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = (m × n) : 2 (hoặc d₁ × d₂ : 2)',
        areaSteps: `S = (${formatNumberVi(d1)} × ${formatNumberVi(d2)}) : 2 = ${formatNumberVi(d1 * d2)} : 2 = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là độ dài cạnh của hình thoi.',
          'm, n (hoặc d₁, d₂) là độ dài hai đường chéo.',
          'Diện tích hình thoi bằng tích độ dài hai đường chéo chia cho 2.',
        ],
      };
    }

    case 'trapezoid': {
      const a = Math.max(0.1, shape.baseA ?? 12); // đáy lớn
      const b = Math.max(0.1, shape.baseB ?? 8);  // đáy bé
      const h = Math.max(0.1, shape.height ?? 5);
      const leg1 = shape.sideB ?? 6;
      const leg2 = shape.sideC ?? 6;
      const P = a + b + leg1 + leg2;
      const S = ((a + b) * h) / 2;

      return {
        perimeter: P,
        perimeterFormula: 'P = tổng độ dài 4 cạnh',
        perimeterSteps: `P = ${formatNumberVi(a)} + ${formatNumberVi(b)} + ${formatNumberVi(leg1)} + ${formatNumberVi(leg2)} = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = (a + b) × h : 2',
        areaSteps: `S = (${formatNumberVi(a)} + ${formatNumberVi(b)}) × ${formatNumberVi(h)} : 2 = ${formatNumberVi(a + b)} × ${formatNumberVi(h)} : 2 = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'a là độ dài đáy lớn, b là độ dài đáy bé, h là chiều cao.',
          'Muốn tính diện tích hình thang ta lấy tổng độ dài hai đáy nhân với chiều cao (cùng đơn vị đo) rồi chia cho 2.',
        ],
      };
    }

    case 'circle': {
      let r = 5;
      let d = 10;
      if (shape.circleInputMode === 'diameter' && shape.diameter) {
        d = shape.diameter;
        r = d / 2;
      } else {
        r = shape.radius ?? 5;
        d = r * 2;
      }

      // Elementary standard: π = 3.14
      const C = d * 3.14; // or 2 * r * 3.14 -> same
      const S = r * r * 3.14;

      return {
        perimeter: C,
        perimeterFormula: 'C = d × 3,14  (hoặc C = r × 2 × 3,14)',
        perimeterSteps: `C = ${formatNumberVi(d)} × 3,14 = ${formatNumberVi(C)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = r × r × 3,14',
        areaSteps: `S = ${formatNumberVi(r)} × ${formatNumberVi(r)} × 3,14 = ${formatNumberVi(r * r)} × 3,14 = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          `Bán kính r = ${formatNumberVi(r)} ${u}; Đường kính d = ${formatNumberVi(d)} ${u} (d = 2 × r).`,
          'Chu vi hình tròn bằng đường kính nhân với 3,14 (hoặc bán kính nhân 2 rồi nhân với 3,14).',
          'Diện tích hình tròn bằng bán kính nhân với bán kính rồi nhân với 3,14.',
        ],
      };
    }

    case 'semicircle': {
      const r = shape.radius ?? 5;
      const d = r * 2;
      const arc = (d * 3.14) / 2;
      const P = arc + d; // chu vi hình gồm nửa đường tròn cộng đường kính
      const S = (r * r * 3.14) / 2;

      return {
        perimeter: P,
        perimeterFormula: 'P = (d × 3,14 : 2) + d',
        perimeterSteps: `P = (${formatNumberVi(d)} × 3,14 : 2) + ${formatNumberVi(d)} = ${formatNumberVi(arc)} + ${formatNumberVi(d)} = ${formatNumberVi(P)} ${u}`,
        perimeterUnit: u,
        area: S,
        areaFormula: 'S = (r × r × 3,14) : 2',
        areaSteps: `S = (${formatNumberVi(r)} × ${formatNumberVi(r)} × 3,14) : 2 = ${formatNumberVi(r * r * 3.14)} : 2 = ${formatNumberVi(S)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'Nửa hình tròn có diện tích bằng một nửa diện tích hình tròn cùng bán kính.',
        ],
      };
    }

    case 'compound': {
      // Sample compound shape: Rectangle (10 x 6) with a triangle attached on top (base 10, height 4)
      const rectA = shape.length ?? 10;
      const rectB = shape.width ?? 6;
      const triH = shape.height ?? 4;
      const sRect = rectA * rectB;
      const sTri = (rectA * triH) / 2;
      const totalS = sRect + sTri;

      return {
        perimeter: 0,
        perimeterFormula: 'Tổng độ dài các cạnh bao quanh ngoài',
        perimeterSteps: `Cộng các cạnh ngoài cùng`,
        perimeterUnit: u,
        area: totalS,
        areaFormula: 'S = S(hình chữ nhật) + S(hình tam giác)',
        areaSteps: `S = (${formatNumberVi(rectA)} × ${formatNumberVi(rectB)}) + (${formatNumberVi(rectA)} × ${formatNumberVi(triH)} : 2) = ${formatNumberVi(sRect)} + ${formatNumberVi(sTri)} = ${formatNumberVi(totalS)} ${au}`,
        areaUnit: au,
        extraNotes: [
          'Hình ghép được chia thành các hình quen thuộc: Hình 1 (chữ nhật) và Hình 2 (tam giác).',
          'Diện tích toàn phần bằng tổng diện tích các hình thành phần.',
        ],
      };
    }

    default:
      return {
        perimeter: 0,
        perimeterFormula: '',
        perimeterSteps: '',
        perimeterUnit: 'cm',
        area: 0,
        areaFormula: '',
        areaSteps: '',
        areaUnit: 'cm²',
      };
  }
}

/**
 * Execute mandatory self-tests to verify exact calculations
 */
export function runMandatoryTests(): { name: string; passed: boolean; details: string }[] {
  const tests = [
    // TEST 1: Rectangle 8 cm × 5 cm -> P = 26 cm, S = 40 cm²
    (() => {
      const res = calculateShape({ type: 'rectangle', name: 'ABCD', points: [], unit: 'cm', length: 8, width: 5 });
      const pass = res.perimeter === 26 && res.area === 40 && res.perimeterUnit === 'cm' && res.areaUnit === 'cm²';
      return {
        name: 'TEST 1: Rectangle 8 cm × 5 cm',
        passed: pass,
        details: `P=${res.perimeter} ${res.perimeterUnit}, S=${res.area} ${res.areaUnit} (Expected: 26 cm, 40 cm²)`,
      };
    })(),

    // TEST 2: Square cạnh 6 cm -> P = 24 cm, S = 36 cm²
    (() => {
      const res = calculateShape({ type: 'square', name: 'ABCD', points: [], unit: 'cm', side: 6 });
      const pass = res.perimeter === 24 && res.area === 36 && res.perimeterUnit === 'cm' && res.areaUnit === 'cm²';
      return {
        name: 'TEST 2: Square 6 cm',
        passed: pass,
        details: `P=${res.perimeter} ${res.perimeterUnit}, S=${res.area} ${res.areaUnit} (Expected: 24 cm, 36 cm²)`,
      };
    })(),

    // TEST 3: Triangle a = 10 cm, h = 6 cm -> S = 30 cm²
    (() => {
      const res = calculateShape({ type: 'triangle', name: 'ABC', points: [], unit: 'cm', baseA: 10, height: 6 });
      const pass = res.area === 30 && res.areaUnit === 'cm²';
      return {
        name: 'TEST 3: Triangle a = 10 cm, h = 6 cm',
        passed: pass,
        details: `S=${res.area} ${res.areaUnit} (Expected: 30 cm²)`,
      };
    })(),

    // TEST 4: Trapezoid a = 8 cm, b = 12 cm, h = 5 cm -> S = 50 cm²
    (() => {
      const res = calculateShape({ type: 'trapezoid', name: 'ABCD', points: [], unit: 'cm', baseA: 12, baseB: 8, height: 5 });
      const pass = res.area === 50 && res.areaUnit === 'cm²';
      return {
        name: 'TEST 4: Trapezoid a = 8 cm, b = 12 cm, h = 5 cm',
        passed: pass,
        details: `S=${res.area} ${res.areaUnit} (Expected: 50 cm²)`,
      };
    })(),

    // TEST 5: Circle r = 5 cm -> C = 31,4 cm, S = 78,5 cm²
    (() => {
      const res = calculateShape({ type: 'circle', name: 'Hình tròn tâm O', points: [], unit: 'cm', radius: 5, circleInputMode: 'radius' });
      const pass = Math.abs(res.perimeter - 31.4) < 0.0001 && Math.abs(res.area - 78.5) < 0.0001 && res.perimeterUnit === 'cm' && res.areaUnit === 'cm²';
      return {
        name: 'TEST 5: Circle r = 5 cm',
        passed: pass,
        details: `C=${res.perimeter} ${res.perimeterUnit}, S=${res.area} ${res.areaUnit} (Expected: 31,4 cm, 78,5 cm²)`,
      };
    })(),

    // TEST 6: Circle d = 10 cm -> r = 5 cm, S = 78,5 cm²
    (() => {
      const res = calculateShape({ type: 'circle', name: 'Hình tròn tâm O', points: [], unit: 'cm', diameter: 10, circleInputMode: 'diameter' });
      const pass = Math.abs(res.area - 78.5) < 0.0001 && res.areaUnit === 'cm²';
      return {
        name: 'TEST 6: Circle d = 10 cm',
        passed: pass,
        details: `S=${res.area} ${res.areaUnit} (Expected: 78,5 cm²)`,
      };
    })(),

    // TEST 7: 1 m = 100 cm
    (() => {
      const val = convertLength(1, 'm', 'cm');
      const pass = val === 100;
      return {
        name: 'TEST 7: 1 m = 100 cm',
        passed: pass,
        details: `1 m = ${val} cm (Expected: 100 cm)`,
      };
    })(),

    // TEST 8: 1 m² = 10 000 cm²
    (() => {
      const val = convertArea(1, 'm²', 'cm²');
      const pass = val === 10000;
      return {
        name: 'TEST 8: 1 m² = 10 000 cm²',
        passed: pass,
        details: `1 m² = ${val} cm² (Expected: 10 000 cm²)`,
      };
    })(),

    // TEST 9: 1 ha = 10 000 m²
    (() => {
      const val = convertArea(1, 'ha', 'm²');
      const pass = val === 10000;
      return {
        name: 'TEST 9: 1 ha = 10 000 m²',
        passed: pass,
        details: `1 ha = ${val} m² (Expected: 10 000 m²)`,
      };
    })(),
  ];

  return tests;
}
