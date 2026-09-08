import { Exercise, LengthUnit, AreaUnit, ShapeType, UserStats, Badge } from '../types';
import { formatNumberVi } from './mathUtils';

export const TOPICS = [
  'Chu vi hình chữ nhật',
  'Diện tích hình chữ nhật',
  'Chu vi hình vuông',
  'Diện tích hình vuông',
  'Diện tích tam giác',
  'Diện tích hình thang',
  'Chu vi hình tròn',
  'Diện tích hình tròn',
  'Tìm cạnh khi biết chu vi',
  'Tìm cạnh khi biết diện tích',
  'Tìm chiều cao',
  'Tìm đáy',
  'Bài toán đổi đơn vị',
  'Bài toán thực tế',
  'Hình ghép',
  'Phần diện tích còn lại',
];

export const BADGES: Badge[] = [
  {
    id: 'starter',
    name: 'Nhà khám phá 🌱',
    icon: '🌱',
    description: 'Bắt đầu hành trình vẽ hình và hoàn thành 1 bài toán',
    unlocked: true,
  },
  {
    id: 'architect',
    name: 'Kiến trúc sư nhí 📐',
    icon: '📐',
    description: 'Đạt chuỗi 3 câu trả lời đúng liên tiếp',
    unlocked: false,
  },
  {
    id: 'master_geom',
    name: 'Cao thủ hình học ⭐',
    icon: '⭐',
    description: 'Đạt từ 100 điểm trở lên',
    unlocked: false,
  },
  {
    id: 'grandmaster',
    name: 'Bậc thầy hình học 🏆',
    icon: '🏆',
    description: 'Giải đúng 10 bài toán với chuỗi 5 câu liên tiếp',
    unlocked: false,
  },
];

export const INITIAL_USER_STATS: UserStats = {
  points: 0,
  streak: 0,
  completedExercises: 0,
  correctCount: 0,
  wrongCount: 0,
  earnedBadges: ['starter'],
};

export function loadUserStats(): UserStats {
  try {
    const saved = localStorage.getItem('xuong_hinh_hoc_stats');
    if (saved) {
      return { ...INITIAL_USER_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not read user stats from localStorage', e);
  }
  return INITIAL_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem('xuong_hinh_hoc_stats', JSON.stringify(stats));
  } catch (e) {
    console.warn('Could not save user stats to localStorage', e);
  }
}

/**
 * Pre-defined curated exercises for Guided Practice (Step-by-step) and Challenge
 */
export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'ex_rect_1',
    title: 'Diện tích mảnh vườn chữ nhật',
    topic: 'Diện tích hình chữ nhật',
    level: 1,
    prompt: 'Một mảnh vườn hình chữ nhật có chiều dài 12 m và chiều rộng 8 m. Tính diện tích mảnh vườn đó.',
    shapeType: 'rectangle',
    defaultData: { length: 12, width: 8, unit: 'm' },
    givenDataText: 'Chiều dài a = 12 m, Chiều rộng b = 8 m',
    targetQuestion: 'Diện tích mảnh vườn (S) = ?',
    questionType: 'area',
    correctValue: 96,
    correctUnit: 'm²',
    expectedFormula: 'S = a × b',
    formulaOptions: ['S = a × b', 'P = (a + b) × 2', 'S = a × a', 'S = a × h : 2'],
    unitOptions: ['m', 'm²', 'cm²', 'ha'],
    hints: [
      'Gợi ý 1: Diện tích hình chữ nhật là phần mặt phẳng được bao quanh bởi 4 cạnh của hình chữ nhật đó.',
      'Gợi ý 2: Muốn tính diện tích hình chữ nhật, ta lấy chiều dài nhân với chiều rộng (cùng một đơn vị đo).',
      'Gợi ý 3: Lấy 12 nhân với 8, chú ý đơn vị diện tích tương ứng với mét là mét vuông (m²).',
    ],
    explanation: 'Diện tích mảnh vườn là: 12 × 8 = 96 (m²).',
    stepGuide: {
      summary: { 'Chiều dài (a)': '12 m', 'Chiều rộng (b)': '8 m' },
      formula: 'S = a × b',
      calculation: '12 × 8 = 96',
      answer: '96 m²',
    },
  },
  {
    id: 'ex_rect_2',
    title: 'Chu vi sân bóng chuyền',
    topic: 'Chu vi hình chữ nhật',
    level: 1,
    prompt: 'Một sân bóng chuyền hình chữ nhật có chiều dài 18 m và chiều rộng 9 m. Tính chu vi sân bóng chuyền đó.',
    shapeType: 'rectangle',
    defaultData: { length: 18, width: 9, unit: 'm' },
    givenDataText: 'Chiều dài a = 18 m, Chiều rộng b = 9 m',
    targetQuestion: 'Chu vi sân bóng (P) = ?',
    questionType: 'perimeter',
    correctValue: 54,
    correctUnit: 'm',
    expectedFormula: 'P = (a + b) × 2',
    formulaOptions: ['P = (a + b) × 2', 'S = a × b', 'P = a × 4', 'P = a + b + c'],
    unitOptions: ['m', 'm²', 'cm', 'dm'],
    hints: [
      'Gợi ý 1: Chu vi là tổng độ dài đường viền bao quanh hình chữ nhật.',
      'Gợi ý 2: Công thức tính chu vi hình chữ nhật: P = (chiều dài + chiều rộng) × 2.',
      'Gợi ý 3: Tính tổng trong ngoặc (18 + 9) rồi nhân với 2. Đơn vị đo chu vi là đơn vị độ dài (m).',
    ],
    explanation: 'Chu vi sân bóng chuyền là: (18 + 9) × 2 = 54 (m).',
    stepGuide: {
      summary: { 'Chiều dài (a)': '18 m', 'Chiều rộng (b)': '9 m' },
      formula: 'P = (a + b) × 2',
      calculation: '(18 + 9) × 2 = 54',
      answer: '54 m',
    },
  },
  {
    id: 'ex_sq_1',
    title: 'Bồn hoa hình vuông',
    topic: 'Diện tích hình vuông',
    level: 1,
    prompt: 'Một bồn hoa hình vuông có cạnh dài 6 m. Tính diện tích của bồn hoa đó.',
    shapeType: 'square',
    defaultData: { side: 6, unit: 'm' },
    givenDataText: 'Cạnh hình vuông a = 6 m',
    targetQuestion: 'Diện tích bồn hoa (S) = ?',
    questionType: 'area',
    correctValue: 36,
    correctUnit: 'm²',
    expectedFormula: 'S = a × a',
    formulaOptions: ['S = a × a', 'P = a × 4', 'S = a × b', 'S = a × h : 2'],
    unitOptions: ['m', 'm²', 'cm²', 'dm²'],
    hints: [
      'Gợi ý 1: Hình vuông có 4 cạnh bằng nhau.',
      'Gợi ý 2: Muốn tính diện tích hình vuông, ta lấy độ dài một cạnh nhân với chính nó: S = a × a.',
      'Gợi ý 3: Thực hiện phép tính 6 × 6. Đơn vị diện tích là m².',
    ],
    explanation: 'Diện tích bồn hoa là: 6 × 6 = 36 (m²).',
    stepGuide: {
      summary: { 'Cạnh (a)': '6 m' },
      formula: 'S = a × a',
      calculation: '6 × 6 = 36',
      answer: '36 m²',
    },
  },
  {
    id: 'ex_tri_1',
    title: 'Biển báo tam giác',
    topic: 'Diện tích tam giác',
    level: 1,
    prompt: 'Một tấm biển báo hình tam giác có độ dài cạnh đáy là 10 cm và chiều cao tương ứng là 6 cm. Tính diện tích tấm biển báo đó.',
    shapeType: 'triangle',
    defaultData: { baseA: 10, height: 6, unit: 'cm' },
    givenDataText: 'Đáy a = 10 cm, Chiều cao h = 6 cm',
    targetQuestion: 'Diện tích biển báo (S) = ?',
    questionType: 'area',
    correctValue: 30,
    correctUnit: 'cm²',
    expectedFormula: 'S = a × h : 2',
    formulaOptions: ['S = a × h : 2', 'S = a × h', 'P = a + b + c', 'S = (a + b) × h : 2'],
    unitOptions: ['cm', 'cm²', 'dm²', 'm²'],
    hints: [
      'Gợi ý 1: Nhớ rằng tam giác có diện tích bằng một nửa hình chữ nhật có cùng đáy và chiều cao.',
      'Gợi ý 2: Công thức tính diện tích hình tam giác: S = a × h : 2 (đáy nhân chiều cao rồi chia cho 2).',
      'Gợi ý 3: Lấy 10 nhân với 6 bằng 60, sau đó lấy 60 chia cho 2.',
    ],
    explanation: 'Diện tích tấm biển báo là: (10 × 6) : 2 = 30 (cm²).',
    stepGuide: {
      summary: { 'Đáy (a)': '10 cm', 'Chiều cao (h)': '6 cm' },
      formula: 'S = a × h : 2',
      calculation: '(10 × 6) : 2 = 30',
      answer: '30 cm²',
    },
  },
  {
    id: 'ex_trap_1',
    title: 'Thửa ruộng hình thang',
    topic: 'Diện tích hình thang',
    level: 2,
    prompt: 'Một thửa ruộng hình thang có đáy lớn 12 m, đáy bé 8 m và chiều cao 5 m. Tính diện tích thửa ruộng đó.',
    shapeType: 'trapezoid',
    defaultData: { baseA: 12, baseB: 8, height: 5, unit: 'm' },
    givenDataText: 'Đáy lớn a = 12 m, Đáy bé b = 8 m, Chiều cao h = 5 m',
    targetQuestion: 'Diện tích thửa ruộng (S) = ?',
    questionType: 'area',
    correctValue: 50,
    correctUnit: 'm²',
    expectedFormula: 'S = (a + b) × h : 2',
    formulaOptions: ['S = (a + b) × h : 2', 'S = (a + b) × 2', 'S = a × h : 2', 'S = a × b'],
    unitOptions: ['m', 'm²', 'ha', 'cm²'],
    hints: [
      'Gợi ý 1: Câu thơ ghi nhớ: "Muốn tính diện tích hình thang / Đáy lớn đáy bé ta đem cộng vào / Cộng vào nhân với chiều cao / Chia đôi lấy nửa thế nào cũng ra".',
      'Gợi ý 2: Công thức diện tích hình thang: S = (a + b) × h : 2.',
      'Gợi ý 3: Bước 1 tính tổng hai đáy (12 + 8 = 20), bước 2 nhân chiều cao rồi chia 2: (20 × 5) : 2 = 50.',
    ],
    explanation: 'Diện tích thửa ruộng là: (12 + 8) × 5 : 2 = 50 (m²).',
    stepGuide: {
      summary: { 'Đáy lớn (a)': '12 m', 'Đáy bé (b)': '8 m', 'Chiều cao (h)': '5 m' },
      formula: 'S = (a + b) × h : 2',
      calculation: '(12 + 8) × 5 : 2 = 50',
      answer: '50 m²',
    },
  },
  {
    id: 'ex_cir_1',
    title: 'Chu vi và diện tích bánh xe',
    topic: 'Chu vi hình tròn',
    level: 2,
    prompt: 'Một bánh xe đạp hình tròn có đường kính 10 cm (tương ứng bán kính r = 5 cm). Hãy tính chu vi của bánh xe đó (với số π lấy là 3,14).',
    shapeType: 'circle',
    defaultData: { diameter: 10, radius: 5, unit: 'cm', circleInputMode: 'diameter' },
    givenDataText: 'Đường kính d = 10 cm (bán kính r = 5 cm)',
    targetQuestion: 'Chu vi bánh xe (C) = ?',
    questionType: 'perimeter',
    correctValue: 31.4,
    correctUnit: 'cm',
    expectedFormula: 'C = d × 3,14',
    formulaOptions: ['C = d × 3,14', 'S = r × r × 3,14', 'C = r × 3,14', 'S = d × 3,14'],
    unitOptions: ['cm', 'cm²', 'dm', 'm'],
    hints: [
      'Gợi ý 1: Chu vi hình tròn là độ dài của một vòng tròn viền ngoài bánh xe.',
      'Gợi ý 2: Công thức tính chu vi hình tròn theo đường kính: C = d × 3,14 (hoặc C = r × 2 × 3,14).',
      'Gợi ý 3: Lấy 10 nhân với 3,14. Chú ý chu vi là đơn vị độ dài (cm), không phải cm².',
    ],
    explanation: 'Chu vi của bánh xe là: 10 × 3,14 = 31,4 (cm).',
    stepGuide: {
      summary: { 'Đường kính (d)': '10 cm', 'Bán kính (r)': '5 cm' },
      formula: 'C = d × 3,14',
      calculation: '10 × 3,14 = 31,4',
      answer: '31,4 cm',
    },
  },
  {
    id: 'ex_cir_2',
    title: 'Diện tích mặt bàn tròn',
    topic: 'Diện tích hình tròn',
    level: 2,
    prompt: 'Một mặt bàn hình tròn có bán kính r = 5 cm. Hãy tính diện tích mặt bàn đó (lấy π = 3,14).',
    shapeType: 'circle',
    defaultData: { radius: 5, unit: 'cm', circleInputMode: 'radius' },
    givenDataText: 'Bán kính r = 5 cm',
    targetQuestion: 'Diện tích mặt bàn (S) = ?',
    questionType: 'area',
    correctValue: 78.5,
    correctUnit: 'cm²',
    expectedFormula: 'S = r × r × 3,14',
    formulaOptions: ['S = r × r × 3,14', 'C = r × 2 × 3,14', 'S = d × 3,14', 'S = r × 3,14'],
    unitOptions: ['cm²', 'cm', 'dm²', 'm²'],
    hints: [
      'Gợi ý 1: Diện tích hình tròn là phần toàn bộ bề mặt bên trong đường tròn.',
      'Gợi ý 2: Công thức tính diện tích hình tròn: S = r × r × 3,14 (bán kính nhân bán kính rồi nhân 3,14).',
      'Gợi ý 3: Lấy 5 × 5 = 25, sau đó lấy 25 × 3,14 = 78,5. Đơn vị diện tích là cm².',
    ],
    explanation: 'Diện tích mặt bàn là: 5 × 5 × 3,14 = 78,5 (cm²).',
    stepGuide: {
      summary: { 'Bán kính (r)': '5 cm' },
      formula: 'S = r × r × 3,14',
      calculation: '5 × 5 × 3,14 = 78,5',
      answer: '78,5 cm²',
    },
  },
  {
    id: 'ex_unit_1',
    title: 'Đổi đơn vị diện tích ruộng đất',
    topic: 'Bài toán đổi đơn vị',
    level: 2,
    prompt: 'Một khu đất trồng lúa có diện tích là 3 ha. Hỏi diện tích khu đất đó bằng bao nhiêu mét vuông (m²)?',
    shapeType: 'rectangle',
    defaultData: { length: 200, width: 150, unit: 'm' },
    givenDataText: 'Diện tích đã cho = 3 ha',
    targetQuestion: 'Đổi 3 ha = ? m²',
    questionType: 'unit_conversion',
    correctValue: 30000,
    correctUnit: 'm²',
    expectedFormula: '1 ha = 10 000 m²',
    formulaOptions: ['1 ha = 10 000 m²', '1 ha = 100 m²', '1 ha = 1 000 m²', '1 m² = 10 000 ha'],
    unitOptions: ['m²', 'ha', 'dm²', 'km²'],
    hints: [
      'Gợi ý 1: Héc-ta (ha) là đơn vị đo diện tích ruộng đất thường gặp trong đời sống.',
      'Gợi ý 2: 1 héc-ta chính bằng 1 héc-tô-mét vuông (1 hm²), tức là 10 000 m².',
      'Gợi ý 3: Lấy 3 nhân với 10 000.',
    ],
    explanation: 'Vì 1 ha = 10 000 m² nên 3 ha = 3 × 10 000 = 30 000 (m²).',
    stepGuide: {
      summary: { 'Diện tích ban đầu': '3 ha' },
      formula: '1 ha = 10 000 m²',
      calculation: '3 × 10 000 = 30 000',
      answer: '30 000 m²',
    },
  },
  {
    id: 'ex_indirect_1',
    title: 'Tìm cạnh hình vuông khi biết chu vi',
    topic: 'Tìm cạnh khi biết chu vi',
    level: 3,
    prompt: 'Một cái ao hình vuông có chu vi là 24 m. Hỏi độ dài một cạnh của cái ao đó là bao nhiêu mét?',
    shapeType: 'square',
    defaultData: { side: 6, unit: 'm' },
    givenDataText: 'Chu vi ao P = 24 m',
    targetQuestion: 'Cạnh ao (a) = ?',
    questionType: 'side',
    correctValue: 6,
    correctUnit: 'm',
    expectedFormula: 'a = P : 4',
    formulaOptions: ['a = P : 4', 'a = P : 2', 'S = a × a', 'P = a × 4'],
    unitOptions: ['m', 'm²', 'cm', 'dm'],
    hints: [
      'Gợi ý 1: Chu vi hình vuông bằng cạnh nhân với 4.',
      'Gợi ý 2: Muốn tìm cạnh của hình vuông khi biết chu vi, ta lấy chu vi chia cho 4: a = P : 4.',
      'Gợi ý 3: Lấy 24 chia cho 4. Kết quả là đơn vị độ dài (m).',
    ],
    explanation: 'Độ dài cạnh ao là: 24 : 4 = 6 (m).',
    stepGuide: {
      summary: { 'Chu vi (P)': '24 m' },
      formula: 'a = P : 4',
      calculation: '24 : 4 = 6',
      answer: '6 m',
    },
  },
  {
    id: 'ex_compound_1',
    title: 'Diện tích mảnh đất hình ghép',
    topic: 'Hình ghép',
    level: 4,
    prompt: 'Một mảnh đất gồm một hình chữ nhật kích thước 10 m × 6 m và một hình tam giác có đáy 10 m, chiều cao 4 m ghép liền kề phía trên. Tính diện tích toàn bộ mảnh đất đó.',
    shapeType: 'compound',
    defaultData: { length: 10, width: 6, height: 4, unit: 'm' },
    givenDataText: 'Hình chữ nhật: 10 m × 6 m; Hình tam giác: đáy 10 m, chiều cao 4 m',
    targetQuestion: 'Diện tích toàn bộ mảnh đất = ?',
    questionType: 'compound',
    correctValue: 80,
    correctUnit: 'm²',
    expectedFormula: 'S = S₁ + S₂',
    formulaOptions: ['S = S₁ + S₂', 'S = a × b', 'S = a × h : 2', 'P = (a + b) × 2'],
    unitOptions: ['m²', 'm', 'ha', 'dm²'],
    hints: [
      'Gợi ý 1: Hãy chia hình ghép thành 2 hình quen thuộc: Hình 1 là hình chữ nhật, Hình 2 là hình tam giác.',
      'Gợi ý 2: Tính diện tích hình chữ nhật (10 × 6 = 60 m²), rồi tính diện tích hình tam giác (10 × 4 : 2 = 20 m²).',
      'Gợi ý 3: Cộng diện tích 2 hình lại: 60 + 20.',
    ],
    explanation: 'Diện tích hình chữ nhật là: 10 × 6 = 60 (m²). Diện tích hình tam giác là: 10 × 4 : 2 = 20 (m²). Diện tích cả mảnh đất là: 60 + 20 = 80 (m²).',
    stepGuide: {
      summary: { 'Hình chữ nhật': '10 m × 6 m', 'Hình tam giác': 'đáy 10 m, cao 4 m' },
      formula: 'S = S(chữ nhật) + S(tam giác)',
      calculation: '(10 × 6) + (10 × 4 : 2) = 60 + 20 = 80',
      answer: '80 m²',
    },
  },
];

/**
 * Generates an exercise dynamically for any topic and level
 */
export function generateRandomExercise(topic?: string, level?: 1 | 2 | 3 | 4): Exercise {
  const chosenLevel = level ?? (Math.floor(Math.random() * 4) + 1 as 1 | 2 | 3 | 4);
  const selectedTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];

  // Seed with nice elementary numbers (integers or clean half decimals like 2.5, 7.5)
  if (selectedTopic.includes('hình chữ nhật') && selectedTopic.includes('Chu vi')) {
    const a = Math.floor(Math.random() * 10) + 6; // 6 to 15
    const b = Math.floor(Math.random() * 5) + 3;  // 3 to 7
    const P = (a + b) * 2;
    return {
      id: 'gen_' + Date.now(),
      title: 'Tính chu vi hình chữ nhật',
      topic: 'Chu vi hình chữ nhật',
      level: chosenLevel,
      prompt: `Một tấm bìa hình chữ nhật có chiều dài ${a} cm và chiều rộng ${b} cm. Tính chu vi tấm bìa đó.`,
      shapeType: 'rectangle',
      defaultData: { length: a, width: b, unit: 'cm' },
      givenDataText: `Chiều dài a = ${a} cm, Chiều rộng b = ${b} cm`,
      targetQuestion: 'Chu vi (P) = ?',
      questionType: 'perimeter',
      correctValue: P,
      correctUnit: 'cm',
      expectedFormula: 'P = (a + b) × 2',
      formulaOptions: ['P = (a + b) × 2', 'S = a × b', 'P = a × 4', 'P = a + b'],
      unitOptions: ['cm', 'cm²', 'm', 'dm'],
      hints: [
        'Gợi ý 1: Chu vi hình chữ nhật bằng tổng chiều dài và chiều rộng nhân 2.',
        'Gợi ý 2: Công thức: P = (a + b) × 2.',
        `Gợi ý 3: Thay số: (${a} + ${b}) × 2 = ${a + b} × 2.`,
      ],
      explanation: `Chu vi là: (${a} + ${b}) × 2 = ${P} (cm).`,
      stepGuide: {
        summary: { 'Chiều dài': `${a} cm`, 'Chiều rộng': `${b} cm` },
        formula: 'P = (a + b) × 2',
        calculation: `(${a} + ${b}) × 2 = ${P}`,
        answer: `${P} cm`,
      },
    };
  }

  if (selectedTopic.includes('hình chữ nhật') && selectedTopic.includes('Diện tích')) {
    const a = Math.floor(Math.random() * 8) + 7; // 7 to 14
    const b = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const S = a * b;
    return {
      id: 'gen_' + Date.now(),
      title: 'Tính diện tích hình chữ nhật',
      topic: 'Diện tích hình chữ nhật',
      level: chosenLevel,
      prompt: `Một thửa ruộng hình chữ nhật có chiều dài ${a} m và chiều rộng ${b} m. Tính diện tích thửa ruộng đó.`,
      shapeType: 'rectangle',
      defaultData: { length: a, width: b, unit: 'm' },
      givenDataText: `Chiều dài a = ${a} m, Chiều rộng b = ${b} m`,
      targetQuestion: 'Diện tích (S) = ?',
      questionType: 'area',
      correctValue: S,
      correctUnit: 'm²',
      expectedFormula: 'S = a × b',
      formulaOptions: ['S = a × b', 'P = (a + b) × 2', 'S = a × a', 'S = a × h : 2'],
      unitOptions: ['m²', 'm', 'cm²', 'ha'],
      hints: [
        'Gợi ý 1: Diện tích hình chữ nhật bằng chiều dài nhân với chiều rộng.',
        'Gợi ý 2: Công thức: S = a × b.',
        `Gợi ý 3: Thực hiện phép tính: ${a} × ${b}. Đơn vị là m².`,
      ],
      explanation: `Diện tích là: ${a} × ${b} = ${S} (m²).`,
      stepGuide: {
        summary: { 'Chiều dài': `${a} m`, 'Chiều rộng': `${b} m` },
        formula: 'S = a × b',
        calculation: `${a} × ${b} = ${S}`,
        answer: `${S} m²`,
      },
    };
  }

  if (selectedTopic.includes('hình tam giác')) {
    const a = (Math.floor(Math.random() * 6) + 4) * 2; // Even numbers 8, 10, 12, 14, 16, 18, 20
    const h = Math.floor(Math.random() * 6) + 4;
    const S = (a * h) / 2;
    return {
      id: 'gen_' + Date.now(),
      title: 'Tính diện tích hình tam giác',
      topic: 'Diện tích tam giác',
      level: chosenLevel,
      prompt: `Một hình tam giác có độ dài đáy là ${a} cm và chiều cao tương ứng là ${h} cm. Tính diện tích hình tam giác đó.`,
      shapeType: 'triangle',
      defaultData: { baseA: a, height: h, unit: 'cm' },
      givenDataText: `Đáy a = ${a} cm, Chiều cao h = ${h} cm`,
      targetQuestion: 'Diện tích (S) = ?',
      questionType: 'area',
      correctValue: S,
      correctUnit: 'cm²',
      expectedFormula: 'S = a × h : 2',
      formulaOptions: ['S = a × h : 2', 'S = a × h', 'P = a + b + c', 'S = (a + b) × h : 2'],
      unitOptions: ['cm²', 'cm', 'm²', 'dm²'],
      hints: [
        'Gợi ý 1: Diện tích tam giác bằng đáy nhân với chiều cao rồi chia cho 2.',
        'Gợi ý 2: Công thức: S = a × h : 2.',
        `Gợi ý 3: Tính: (${a} × ${h}) : 2 = ${a * h} : 2.`,
      ],
      explanation: `Diện tích là: (${a} × ${h}) : 2 = ${S} (cm²).`,
      stepGuide: {
        summary: { 'Đáy (a)': `${a} cm`, 'Chiều cao (h)': `${h} cm` },
        formula: 'S = a × h : 2',
        calculation: `(${a} × ${h}) : 2 = ${S}`,
        answer: `${S} cm²`,
      },
    };
  }

  if (selectedTopic.includes('hình thang')) {
    const a = Math.floor(Math.random() * 6) + 8; // đáy lớn 8 to 13
    const b = Math.floor(Math.random() * 4) + 4; // đáy bé 4 to 7
    // make sure (a + b) * h is divisible by 2
    const h = (Math.floor(Math.random() * 3) + 2) * 2; // 4, 6, 8
    const S = ((a + b) * h) / 2;
    return {
      id: 'gen_' + Date.now(),
      title: 'Tính diện tích hình thang',
      topic: 'Diện tích hình thang',
      level: chosenLevel,
      prompt: `Một mảnh đất hình thang có đáy lớn ${a} m, đáy bé ${b} m và chiều cao ${h} m. Tính diện tích mảnh đất đó.`,
      shapeType: 'trapezoid',
      defaultData: { baseA: a, baseB: b, height: h, unit: 'm' },
      givenDataText: `Đáy lớn a = ${a} m, Đáy bé b = ${b} m, Chiều cao h = ${h} m`,
      targetQuestion: 'Diện tích (S) = ?',
      questionType: 'area',
      correctValue: S,
      correctUnit: 'm²',
      expectedFormula: 'S = (a + b) × h : 2',
      formulaOptions: ['S = (a + b) × h : 2', 'S = (a + b) × 2', 'S = a × h', 'S = a × b : 2'],
      unitOptions: ['m²', 'm', 'ha', 'cm²'],
      hints: [
        'Gợi ý 1: Lấy tổng hai đáy nhân với chiều cao rồi chia cho 2.',
        'Gợi ý 2: Công thức: S = (a + b) × h : 2.',
        `Gợi ý 3: Tính tổng hai đáy (${a} + ${b} = ${a + b}), nhân ${h} rồi chia 2.`,
      ],
      explanation: `Diện tích là: (${a} + ${b}) × ${h} : 2 = ${S} (m²).`,
      stepGuide: {
        summary: { 'Đáy lớn': `${a} m`, 'Đáy bé': `${b} m`, 'Chiều cao': `${h} m` },
        formula: 'S = (a + b) × h : 2',
        calculation: `(${a} + ${b}) × ${h} : 2 = ${S}`,
        answer: `${S} m²`,
      },
    };
  }

  if (selectedTopic.includes('hình tròn') && selectedTopic.includes('Chu vi')) {
    const d = (Math.floor(Math.random() * 5) + 2) * 2; // 4, 6, 8, 10, 12
    const r = d / 2;
    const C = Math.round(d * 3.14 * 100) / 100;
    return {
      id: 'gen_' + Date.now(),
      title: 'Tính chu vi hình tròn',
      topic: 'Chu vi hình tròn',
      level: chosenLevel,
      prompt: `Một hình tròn có đường kính d = ${d} cm (bán kính r = ${r} cm). Tính chu vi của hình tròn đó (lấy π = 3,14).`,
      shapeType: 'circle',
      defaultData: { diameter: d, radius: r, unit: 'cm' },
      givenDataText: `Đường kính d = ${d} cm (r = ${r} cm)`,
      targetQuestion: 'Chu vi (C) = ?',
      questionType: 'perimeter',
      correctValue: C,
      correctUnit: 'cm',
      expectedFormula: 'C = d × 3,14',
      formulaOptions: ['C = d × 3,14', 'C = r × 3,14', 'S = r × r × 3,14', 'S = d × 3,14'],
      unitOptions: ['cm', 'cm²', 'm', 'dm'],
      hints: [
        'Gợi ý 1: Chu vi hình tròn bằng đường kính nhân 3,14.',
        'Gợi ý 2: Công thức: C = d × 3,14 (hoặc r × 2 × 3,14).',
        `Gợi ý 3: Tính: ${d} × 3,14. Đơn vị là cm.`,
      ],
      explanation: `Chu vi hình tròn là: ${d} × 3,14 = ${formatNumberVi(C)} (cm).`,
      stepGuide: {
        summary: { 'Đường kính': `${d} cm`, 'Bán kính': `${r} cm` },
        formula: 'C = d × 3,14',
        calculation: `${d} × 3,14 = ${formatNumberVi(C)}`,
        answer: `${formatNumberVi(C)} cm`,
      },
    };
  }

  // Fallback to one of the curated exercises
  const randomCurated = SAMPLE_EXERCISES[Math.floor(Math.random() * SAMPLE_EXERCISES.length)];
  return { ...randomCurated, id: 'sample_' + Date.now() };
}

export interface ValidationFeedback {
  isCorrect: boolean;
  scoreGained: number;
  mainMessage: string;
  errorType?: 'formula' | 'arithmetic' | 'unit' | 'missing_unit' | 'confused_perimeter_area' | 'confused_radius_diameter' | 'negative';
  diagnosticDetail: string;
  suggestedAction: string;
}

/**
 * Intelligent error diagnosis for student submission
 */
export function diagnoseAnswer(
  userValue: number,
  userUnit: string,
  userFormula: string,
  exercise: Exercise
): ValidationFeedback {
  // Check formula if provided
  if (userFormula && exercise.expectedFormula && userFormula !== exercise.expectedFormula) {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Công thức chưa chính xác rồi!',
      errorType: 'formula',
      diagnosticDetail: `Em đã chọn công thức "${userFormula}". Đối với bài toán "${exercise.targetQuestion}", công thức chuẩn là "${exercise.expectedFormula}".`,
      suggestedAction: 'Hãy xem lại mục gợi ý công thức hoặc tra cứu trong Sổ tay công thức nhé!',
    };
  }

  // Check for negative or 0 values
  if (userValue <= 0) {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Số đo phải là số dương!',
      errorType: 'negative',
      diagnosticDetail: 'Kích thước hoặc kết quả hình học không thể nhỏ hơn hoặc bằng 0.',
      suggestedAction: 'Em hãy kiểm tra lại các số trong đề bài nhé.',
    };
  }

  // Check if student forgot unit
  if (!userUnit || userUnit.trim() === '') {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Em chưa chọn đơn vị đo!',
      errorType: 'missing_unit',
      diagnosticDetail: `Kết quả tính toán cần phải có đơn vị kèm theo (${exercise.correctUnit}).`,
      suggestedAction: 'Hãy chọn đúng đơn vị trong danh sách đơn vị đo.',
    };
  }

  // Check confusion between length unit and area unit
  const isTargetArea = exercise.questionType === 'area' || exercise.questionType === 'compound';
  const isTargetPerimeter = exercise.questionType === 'perimeter';

  if (isTargetArea && !userUnit.includes('²') && userUnit !== 'ha') {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Nhầm lẫn giữa đơn vị độ dài và đơn vị diện tích!',
      errorType: 'unit',
      diagnosticDetail: `Bài toán yêu cầu tính Diện tích. Đơn vị diện tích phải có số 2 ở trên đầu (như ${exercise.correctUnit}), không được dùng đơn vị độ dài ${userUnit}.`,
      suggestedAction: `Em hãy đổi sang đơn vị ${exercise.correctUnit} nhé!`,
    };
  }

  if (isTargetPerimeter && (userUnit.includes('²') || userUnit === 'ha')) {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Chu vi phải dùng đơn vị độ dài!',
      errorType: 'unit',
      diagnosticDetail: `Chu vi là tổng độ dài đường viền bao quanh hình, nên chỉ dùng đơn vị độ dài như ${exercise.correctUnit}, không dùng đơn vị diện tích ${userUnit}.`,
      suggestedAction: `Em hãy chọn đơn vị độ dài ${exercise.correctUnit}.`,
    };
  }

  // Check if numerical value is close to perimeter when area was asked
  if (exercise.shapeType === 'rectangle' && exercise.questionType === 'area' && exercise.defaultData.length && exercise.defaultData.width) {
    const pVal = (exercise.defaultData.length + exercise.defaultData.width) * 2;
    if (Math.abs(userValue - pVal) < 0.01) {
      return {
        isCorrect: false,
        scoreGained: 0,
        mainMessage: 'Em đang tính Chu vi thay vì Diện tích!',
        errorType: 'confused_perimeter_area',
        diagnosticDetail: `Giá trị ${formatNumberVi(userValue)} là chu vi P = (a + b) × 2. Đề bài đang hỏi Diện tích S = a × b.`,
        suggestedAction: `Hãy nhân chiều dài với chiều rộng: ${exercise.defaultData.length} × ${exercise.defaultData.width}.`,
      };
    }
  }

  // Check diameter / radius confusion for circles
  if (exercise.shapeType === 'circle') {
    const r = exercise.defaultData.radius ?? 5;
    const d = exercise.defaultData.diameter ?? (r * 2);
    // If student used d instead of r for area: d * d * 3.14
    if (Math.abs(userValue - (d * d * 3.14)) < 0.05) {
      return {
        isCorrect: false,
        scoreGained: 0,
        mainMessage: 'Em đang dùng đường kính làm bán kính!',
        errorType: 'confused_radius_diameter',
        diagnosticDetail: `Em đã tính S = ${d} × ${d} × 3,14. Nhưng ${d} cm là đường kính d! Bán kính r = d : 2 = ${r} cm.`,
        suggestedAction: `Hãy nhớ tính theo bán kính: S = ${r} × ${r} × 3,14.`,
      };
    }
  }

  // Check unit match
  if (userUnit !== exercise.correctUnit) {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Đơn vị đo chưa đúng!',
      errorType: 'unit',
      diagnosticDetail: `Đơn vị đúng cho bài này là "${exercise.correctUnit}", trong khi em đang chọn "${userUnit}".`,
      suggestedAction: `Em hãy đổi lại đơn vị thành "${exercise.correctUnit}".`,
    };
  }

  // Check numerical value
  const diff = Math.abs(userValue - exercise.correctValue);
  if (diff > 0.05) {
    return {
      isCorrect: false,
      scoreGained: 0,
      mainMessage: 'Kết quả tính toán chưa chính xác!',
      errorType: 'arithmetic',
      diagnosticDetail: `Số em nhập là ${formatNumberVi(userValue)}, kết quả đúng là ${formatNumberVi(exercise.correctValue)}.`,
      suggestedAction: 'Em hãy đặt tính cẩn thận ra nháp và tính lại từng bước nhé!',
    };
  }

  // EXACT MATCH!
  return {
    isCorrect: true,
    scoreGained: 10,
    mainMessage: 'Chính xác! Tuyệt vời! ⭐ +10 điểm',
    diagnosticDetail: `Em đã áp dụng đúng công thức ${exercise.expectedFormula} và tính ra đáp số chính xác: ${formatNumberVi(exercise.correctValue)} ${exercise.correctUnit}.`,
    suggestedAction: 'Tiếp tục phát huy ở câu tiếp theo nhé!',
  };
}
