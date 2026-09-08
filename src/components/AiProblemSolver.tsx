import React, { useState, useRef } from 'react';
import {
  ExtractedProblem,
  ShapeData,
  Exercise,
  LengthUnit,
} from '../types';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  PenTool,
  BookOpen,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  Lightbulb,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AiProblemSolverProps {
  onLoadShapeToStudio: (shapeData: Partial<ShapeData>) => void;
  onLoadToPractice: (exercise: Exercise) => void;
}

// Sample Grade 5 Geometry problems for 1-click test
const SAMPLE_PROBLEMS = [
  {
    title: 'Hình thang (Thửa ruộng)',
    text: 'Một thửa ruộng hình thang có đáy lớn 120 m, đáy bé bằng 2/3 đáy lớn, chiều cao bằng 40 m. Người ta cấy lúa trên thửa ruộng đó, cứ 100 m² thu hoạch được 65 kg thóc. Hỏi cả thửa ruộng thu hoạch được bao nhiêu tạ thóc?',
  },
  {
    title: 'Hình chữ nhật (Tổng - Tỉ)',
    text: 'Một khu đất hình chữ nhật có chu vi là 140 m. Chiều rộng bằng 3/4 chiều dài. Tính diện tích của khu đất đó ra mét vuông và héc-ta.',
  },
  {
    title: 'Hình tròn (Đường kính & Diện tích)',
    text: 'Một biển báo giao thông hình tròn có đường kính là 50 cm. Người ta sơn hai mặt của biển báo đó, mỗi mét vuông hết 40.000 đồng. Tính số tiền dùng để sơn biển báo giao thông đó.',
  },
  {
    title: 'Hình tam giác (Tăng đáy)',
    text: 'Một mảnh đất hình tam giác có đáy 25 m và chiều cao 16 m. Người ta kéo dài đáy thêm 5 m thì diện tích tăng thêm bao nhiêu mét vuông?',
  },
  {
    title: 'Hình thoi (Đường chéo)',
    text: 'Một tấm bìa hình thoi có độ dài hai đường chéo lần lượt là 14 dm và 8 dm. Tính diện tích của tấm bìa hình thoi đó theo đơn vị đề-xi-mét vuông.',
  },
];

export const AiProblemSolver: React.FC<AiProblemSolverProps> = ({
  onLoadShapeToStudio,
  onLoadToPractice,
}) => {
  // Upload and Input States
  const [promptText, setPromptText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl?: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  // Drag over status
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Analysis and Results State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedProblems, setExtractedProblems] = useState<ExtractedProblem[]>([]);
  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data:mime/type;base64, prefix
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle incoming file
  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    try {
      const base64 = await fileToBase64(file);
      let previewUrl: string | undefined = undefined;

      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      setSelectedFile({
        file,
        previewUrl,
        base64,
        mimeType: file.type || 'application/octet-stream',
      });
    } catch (err: any) {
      setErrorMessage('Không thể đọc tệp tin: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  // Handle File Input Change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Remove current file
  const handleRemoveFile = () => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit to Server for AI Geometry Analysis
  const handleSolve = async () => {
    if (!promptText.trim() && !selectedFile) {
      setErrorMessage('Vui lòng nhập đề bài hoặc tải lên ảnh / tệp PDF / tệp Word.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setExtractedProblems([]);
    setActiveProblemIndex(0);

    try {
      const payload: any = {
        prompt: promptText.trim(),
      };

      if (selectedFile) {
        payload.file = {
          name: selectedFile.file.name,
          mimeType: selectedFile.mimeType,
          base64: selectedFile.base64,
        };
      }

      const response = await fetch('/api/ai/solve-geometry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Lỗi khi giải bài toán qua máy chủ.');
      }

      if (!data.problems || !Array.isArray(data.problems) || data.problems.length === 0) {
        throw new Error('Không nhận diện được bài toán hình học nào trong nội dung bạn cung cấp. Vui lòng kiểm tra lại ảnh hoặc văn bản đề bài.');
      }

      setExtractedProblems(data.problems);
      setActiveProblemIndex(0);
    } catch (err: any) {
      console.error('Solve error:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Hãy thử lại hoặc kiểm tra kết nối mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentProblem = extractedProblems[activeProblemIndex];

  // Action: Load extracted shape into drawing studio
  const handleLoadToStudio = (problem: ExtractedProblem) => {
    const params = problem.shapeParams;
    const newShapeData: Partial<ShapeData> = {
      type: problem.shapeType,
      name: problem.title || `Hình bài toán (${problem.shapeType})`,
      unit: (params?.unit || 'cm') as LengthUnit,
      length: params?.length,
      width: params?.width,
      side: params?.side,
      baseA: params?.baseA,
      baseB: params?.baseB,
      height: params?.height,
      radius: params?.radius,
      diameter: params?.diameter,
      diagonal1: params?.diagonal1,
      diagonal2: params?.diagonal2,
      showAltitude: params?.showAltitude ?? (problem.shapeType === 'triangle' || problem.shapeType === 'trapezoid'),
      showDimensions: true,
      showVerticesLabels: true,
    };

    onLoadShapeToStudio(newShapeData);
  };

  // Action: Load to practice guided mode
  const handleLoadToPractice = (problem: ExtractedProblem) => {
    // Construct an Exercise compatible object
    const ex: Exercise = {
      id: problem.id || `custom-${Date.now()}`,
      title: problem.title,
      topic: `Hình ${problem.shapeType}`,
      level: 3,
      prompt: problem.originalPrompt,
      shapeType: problem.shapeType,
      defaultData: {
        unit: problem.shapeParams.unit,
        length: problem.shapeParams.length,
        width: problem.shapeParams.width,
        side: problem.shapeParams.side,
        baseA: problem.shapeParams.baseA,
        baseB: problem.shapeParams.baseB,
        height: problem.shapeParams.height,
        radius: problem.shapeParams.radius,
        diameter: problem.shapeParams.diameter,
        diagonal1: problem.shapeParams.diagonal1,
        diagonal2: problem.shapeParams.diagonal2,
      },
      givenDataText: problem.summary.given.join(', '),
      targetQuestion: problem.summary.target,
      questionType: (problem.targetQuestionType as any) || 'area',
      correctValue: parseFloat(problem.finalAnswer.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
      correctUnit: problem.shapeParams.unit,
      expectedFormula: problem.solutionSteps[0]?.formulaExplanation || '',
      formulaOptions: [
        'S = a × b',
        'S = a × h : 2',
        'S = (a + b) × h : 2',
        'S = r × r × 3,14',
      ],
      unitOptions: ['cm', 'm', 'dm', 'cm²', 'm²', 'dm²'],
      hints: [
        'Bước 1: Tóm tắt bài toán và kiểm tra các đơn vị đo.',
        problem.solutionSteps[0]?.formulaExplanation || 'Áp dụng công thức hình học chuẩn.',
        problem.pedagogicalNote || 'Thực hiện cẩn thận từng phép tính.',
      ],
      explanation: problem.solutionSteps.map((s) => `${s.title} ${s.calculation}`).join('\n'),
      stepGuide: {
        summary: { 'Dữ kiện': problem.summary.given.join(', ') },
        formula: problem.solutionSteps[0]?.formulaExplanation || '',
        calculation: problem.solutionSteps.map((s) => s.calculation).join('; '),
        answer: problem.finalAnswer,
      },
    };

    onLoadToPractice(ex);
  };

  // Copy solution to clipboard
  const handleCopySolution = (problem: ExtractedProblem) => {
    let fullText = `ĐỀ BÀI: ${problem.title}\n${problem.originalPrompt}\n\n`;
    fullText += `TÓM TẮT:\n- Cho biết: ${problem.summary.given.join(', ')}\n- Cần tìm: ${problem.summary.target}\n\n`;
    fullText += `BÀI GIẢI:\n`;
    problem.solutionSteps.forEach((step) => {
      fullText += `${step.title}\n   ${step.calculation}\n`;
    });
    fullText += `\nĐÁP SỐ: ${problem.finalAnswer}\n`;
    if (problem.pedagogicalNote) {
      fullText += `* Lời khuyên: ${problem.pedagogicalNote}\n`;
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 rounded-3xl p-5 sm:p-7 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-bold w-fit backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trí tuệ nhân tạo Sư phạm Toán Lớp 5</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Tải Đề Bài (Ảnh, PDF, Word) – Vẽ Hình & Giải Tự Động
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Chụp ảnh sách giáo khoa, tải phiếu bài tập PDF hoặc tệp Word. Hệ thống sẽ tự động nhận diện hình học, trích xuất số đo, vẽ hình tương tác trên canvas và hướng dẫn giải từng bước chuẩn giáo dục tiểu học.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs">
          <div className="flex flex-col gap-1.5 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-[10px]">✓</span>
              <span>Ảnh chụp bài tập (.jpg, .png)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-[10px]">✓</span>
              <span>Phiếu đề thi PDF (.pdf)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-[10px]">✓</span>
              <span>Đề cương tài liệu Word (.docx)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UPLOAD & INPUT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Dropzone & Text Prompt (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>1. Tải lên tệp tài liệu hoặc ảnh chụp đề bài</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Hỗ trợ Ảnh, PDF, Word
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[140px] ${
                isDragging
                  ? 'border-sky-500 bg-sky-50/70 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.docx,.doc,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!selectedFile ? (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Nhấp để chọn tệp hoặc kéo thả vào đây
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ảnh chụp điện thoại (.jpg, .png) • Tài liệu PDF • Tệp Word (.docx)
                    </p>
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center justify-between w-full p-2.5 rounded-xl bg-white border border-emerald-200 shadow-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {selectedFile.previewUrl ? (
                      <img
                        src={selectedFile.previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs uppercase">
                        {selectedFile.file.name.split('.').pop() || 'FILE'}
                      </div>
                    )}

                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[240px] sm:max-w-xs">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(selectedFile.file.size / 1024).toFixed(1)} KB • {selectedFile.mimeType}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Xóa tệp này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Direct Text Prompt Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>2. Hoặc nhập / dán đề bài toán hình học:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  (Có thể gõ kèm yêu cầu riêng)
                </span>
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ví dụ: Một thửa ruộng hình thang có đáy lớn 150m, đáy bé 90m, chiều cao 50m. Tính diện tích thửa ruộng..."
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition outline-hidden resize-y bg-slate-50/50"
              />
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Chưa thể phân tích bài toán</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={handleSolve}
              disabled={isLoading || (!promptText.trim() && !selectedFile)}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                isLoading || (!promptText.trim() && !selectedFile)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200 hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đọc hiểu đề bài & tạo mô hình hình học...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>PHÂN TÍCH, VẼ HÌNH & GIẢI BÀI TOÁN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Sample Problems to Test 1-Click (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-800">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-bold">
                Thử nhanh với các đề mẫu Lớp 5 kinh điển:
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Bấm vào bất kỳ bài mẫu nào dưới đây để nạp nhanh nội dung và trải nghiệm:
            </p>

            <div className="flex flex-col gap-2">
              {SAMPLE_PROBLEMS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptText(sample.text);
                    setSelectedFile(null);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition flex flex-col gap-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 group-hover:text-sky-900">
                      {sample.title}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-sky-600">
                      Chọn bài này →
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {sample.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. EXTRACTED PROBLEMS & INTERACTIVE RESULTS */}
      {extractedProblems.length > 0 && currentProblem && (
        <div className="bg-white rounded-3xl border border-sky-200 p-5 sm:p-7 shadow-xs flex flex-col gap-6">
          {/* Header Bar with Tabs if multiple exercises detected */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                {activeProblemIndex + 1}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {currentProblem.title}
                </h3>
                <span className="text-xs text-slate-500">
                  Hình học Lớp 5 • Nhận diện dạng: <span className="font-bold text-sky-700 uppercase">{currentProblem.shapeType}</span>
                </span>
              </div>
            </div>

            {/* Multiple Exercises Selector if more than 1 problem */}
            {extractedProblems.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <span className="text-[11px] font-bold text-slate-500 px-2">Bài:</span>
                {extractedProblems.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveProblemIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      activeProblemIndex === i
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Quote */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <span className="font-bold text-slate-900 block mb-1">📖 Đề bài nguyên văn:</span>
            {currentProblem.originalPrompt}
          </div>

          {/* Quick Action Buttons to Load into Studio & Practice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Action 1: Load to Draw Studio */}
            <button
              type="button"
              onClick={() => handleLoadToStudio(currentProblem)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4 text-amber-300" />
              <span>VẼ HÌNH NÀY TRONG XƯỞNG VẼ</span>
            </button>

            {/* Action 2: Load to Practice */}
            <button
              type="button"
              onClick={() => handleLoadToPractice(currentProblem)}
              className="p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>TỰ GIẢI TRONG CHẾ ĐỘ LUYỆN TẬP</span>
            </button>

            {/* Action 3: Copy Solution */}
            <button
              type="button"
              onClick={() => handleCopySolution(currentProblem)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">ĐÃ SAO CHÉP LỜI GIẢI</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>SAO CHÉP LỜI GIẢI VÀO BỘ NHỚ</span>
                </>
              )}
            </button>
          </div>

          {/* Summary & Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tóm tắt bài toán */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col gap-2">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>📋 TÓM TẮT BÀI TOÁN</span>
              </h4>
              <div className="flex flex-col gap-1 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Cho biết:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                  {currentProblem.summary.given.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-amber-200/60">
                  <span className="font-semibold text-slate-900">Hỏi: </span>
                  <span className="text-amber-900 font-bold">{currentProblem.summary.target}</span>
                </div>
              </div>
            </div>

            {/* Kích thước hình học trích xuất */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col gap-2">
              <h4 className="text-xs font-black text-sky-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>📐 THÔNG SỐ HÌNH HỌC ĐỂ VẼ</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <span className="text-slate-500 block text-[10px]">Loại hình:</span>
                  <span className="font-bold text-sky-800 uppercase">{currentProblem.shapeType}</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <span className="text-slate-500 block text-[10px]">Đơn vị đo:</span>
                  <span className="font-bold text-sky-800">{currentProblem.shapeParams.unit}</span>
                </div>
                {currentProblem.shapeParams.length !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Chiều dài (a):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.length} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.width !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Chiều rộng (b):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.width} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.side !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Cạnh (a):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.side} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.baseA !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Đáy lớn (a):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.baseA} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.baseB !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Đáy bé (b):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.baseB} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.height !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Chiều cao (h):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.height} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.radius !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Bán kính (r):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.radius} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
                {currentProblem.shapeParams.diameter !== undefined && (
                  <div className="p-2 rounded-xl bg-white border border-sky-100">
                    <span className="text-slate-500 block text-[10px]">Đường kính (d):</span>
                    <span className="font-bold text-slate-800">{currentProblem.shapeParams.diameter} {currentProblem.shapeParams.unit}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>BÀI GIẢI CHI TIẾT (CHUẨN TIỂU HỌC LỚP 5)</span>
            </h4>

            <div className="flex flex-col gap-3">
              {currentProblem.solutionSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-black">
                      Bước {step.stepNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.title}
                    </span>
                  </div>

                  {step.formulaExplanation && (
                    <p className="text-[11px] text-slate-500 italic pl-3">
                      Công thức: {step.formulaExplanation}
                    </p>
                  )}

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm font-bold text-indigo-900 pl-3">
                    {step.calculation}
                  </div>

                  {step.resultNote && (
                    <p className="text-[11px] text-slate-500 pl-3">
                      {step.resultNote}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Đáp số */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-emerald-900">
                ĐÁP SỐ:
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-700">
                {currentProblem.finalAnswer}
              </span>
            </div>

            {/* Pedagogical Note / Golden Advice */}
            {currentProblem.pedagogicalNote && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-950">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Lời dặn của thầy/cô giáo:</span>
                  <p>{currentProblem.pedagogicalNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
