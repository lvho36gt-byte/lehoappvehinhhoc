import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import mammoth from "mammoth";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Support large payload for images, pdf, and word docs
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint to parse docx or extract text if needed
app.post("/api/ai/extract-doc-text", async (req, res) => {
  try {
    const { base64, mimeType } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "Không tìm thấy dữ liệu tệp tin." });
    }

    const buffer = Buffer.from(base64, "base64");
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return res.json({ text: result.value });
    }

    // Plain text
    const text = buffer.toString("utf-8");
    return res.json({ text });
  } catch (err: any) {
    console.error("Doc extract error:", err);
    return res.status(500).json({ error: "Không thể trích xuất văn bản từ tệp Word: " + (err.message || "") });
  }
});

// Endpoint to solve Grade 5 Geometry problems using Gemini 3.8 Flash
app.post("/api/ai/solve-geometry", async (req, res) => {
  try {
    const { prompt, file } = req.body;
    // file: { mimeType: string, base64: string, name?: string }

    if (!prompt && !file) {
      return res.status(400).json({ error: "Vui lòng cung cấp đề bài toán, ảnh chụp, tệp PDF hoặc tệp Word." });
    }

    const ai = getGeminiClient();

    // Prepare contents
    const contents: any[] = [];

    // If file is provided
    if (file && file.base64 && file.mimeType) {
      if (
        file.mimeType.startsWith("image/") ||
        file.mimeType === "application/pdf"
      ) {
        contents.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
          },
        });
      } else if (
        file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimeType === "application/msword"
      ) {
        // Extract Word text first
        try {
          const buffer = Buffer.from(file.base64, "base64");
          const extracted = await mammoth.extractRawText({ buffer });
          contents.push({
            text: `[NỘI DUNG TRÍCH XUẤT TỪ FILE WORD]:\n${extracted.value}`,
          });
        } catch (docxErr: any) {
          console.warn("Failed to extract docx with mammoth, trying raw buffer text:", docxErr);
        }
      } else {
        // Try text decode
        try {
          const buffer = Buffer.from(file.base64, "base64");
          contents.push({
            text: `[NỘI DUNG TỆP VĂN BẢN]:\n${buffer.toString("utf-8")}`,
          });
        } catch {
          // Ignore
        }
      }
    }

    const instructionText = `
Bạn là chuyên gia Sư phạm Hình học Tiểu học Lớp 5 theo Chương trình Giáo dục Phổ thông Việt Nam (sách giáo khoa Kết nối tri thức, Chân trời sáng tạo, Cánh diều).

Nhiệm vụ: Phân tích hình ảnh, tệp PDF, tài liệu Word hoặc đề bài toán hình học Lớp 5 được gửi lên.
Hãy nhận diện tất cả các bài toán hình học có trong tài liệu/ảnh.
Đối với mỗi bài toán (hoặc bài toán chính nếu có 1 bài), trích xuất và giải quyết theo đúng chuẩn sư phạm Tiểu học:
1. Xác định đúng loại hình học thuộc chương trình Lớp 5:
   - "rectangle" (Hình chữ nhật)
   - "square" (Hình vuông)
   - "triangle" (Hình tam giác)
   - "right_triangle" (Hình tam giác vuông)
   - "parallelogram" (Hình bình hành)
   - "rhombus" (Hình thoi)
   - "trapezoid" (Hình thang)
   - "circle" (Hình tròn)
   - "semicircle" (Nửa hình tròn)
   - "compound" (Hình ghép kết hợp chữ nhật, vuông, tam giác...)
   - "segment" (Đoạn thẳng)

2. Trích xuất các kích thước số thực tế để vẽ được hình trên canvas:
   - Đơn vị đo độ dài chuẩn: "mm", "cm", "dm", "m", "dam", "hm", "km"
   - length, width, side, baseA, baseB, height, radius, diameter, diagonal1, diagonal2
   - Chú ý: Nếu đề bài cho chu vi hoặc diện tích và tỉ số để tìm cạnh (dạng toán Tổng - Tỉ, Hiệu - Tỉ), hãy tính ra kích thước cạnh cụ thể để đưa vào shapeParams giúp hệ thống tự động vẽ hình trực quan!

3. Tóm tắt đề bài chuẩn Tiểu học:
   - Cho biết gì (các dữ kiện)
   - Hỏi gì (yêu cầu bài toán)

4. Lời giải chi tiết từng bước chuẩn phong cách Tiểu học Lớp 5:
   - Lời văn rõ ràng
   - Phép tính có kèm đơn vị đo trong dấu ngoặc đơn (Ví dụ: 12 × 8 : 2 = 48 (cm²))
   - Sử dụng số Pi chuẩn Lớp 5 là 3,14
   - Đổi đơn vị đo nếu các dữ kiện chưa cùng đơn vị trước khi tính
   - Đáp số rõ ràng

5. Đưa ra lời khuyên/lưu ý phương pháp (pedagogicalNote) hữu ích cho học sinh lớp 5 khi gặp dạng toán này.

Nội dung đề bài người dùng yêu cầu thêm (nếu có):
${prompt || "Hãy phân tích và giải chi tiết các bài toán hình học trong ảnh/tài liệu này."}
`;

    contents.push({ text: instructionText });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents.length === 1 ? contents[0].text : { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problems: {
              type: Type.ARRAY,
              description: "Danh sách các bài toán hình học được phát hiện trong tài liệu",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Tiêu đề bài toán (vd: Bài 1: Tính diện tích hình thang)" },
                  originalPrompt: { type: Type.STRING, description: "Đề bài nguyên văn đầy đủ" },
                  shapeType: {
                    type: Type.STRING,
                    description: "Loại hình học: rectangle, square, triangle, right_triangle, parallelogram, rhombus, trapezoid, circle, semicircle, compound, segment",
                  },
                  shapeParams: {
                    type: Type.OBJECT,
                    description: "Các thông số kích thước để vẽ hình",
                    properties: {
                      unit: { type: Type.STRING, description: "Đơn vị đo độ dài: cm, m, dm, mm..." },
                      length: { type: Type.NUMBER },
                      width: { type: Type.NUMBER },
                      side: { type: Type.NUMBER },
                      baseA: { type: Type.NUMBER },
                      baseB: { type: Type.NUMBER },
                      height: { type: Type.NUMBER },
                      radius: { type: Type.NUMBER },
                      diameter: { type: Type.NUMBER },
                      diagonal1: { type: Type.NUMBER },
                      diagonal2: { type: Type.NUMBER },
                      showAltitude: { type: Type.BOOLEAN },
                    },
                    required: ["unit"],
                  },
                  summary: {
                    type: Type.OBJECT,
                    description: "Tóm tắt đề bài theo chuẩn Tiểu học",
                    properties: {
                      given: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Các dữ kiện bài toán đã cho",
                      },
                      target: { type: Type.STRING, description: "Yêu cầu cần tìm" },
                    },
                    required: ["given", "target"],
                  },
                  solutionSteps: {
                    type: Type.ARRAY,
                    description: "Các bước giải chi tiết",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING, description: "Câu lời giải (vd: Diện tích hình tam giác là:)" },
                        formulaExplanation: { type: Type.STRING, description: "Công thức áp dụng (vd: S = a × h : 2)" },
                        calculation: { type: Type.STRING, description: "Phép tính kèm đơn vị trong ngoặc (vd: 15 × 8 : 2 = 60 (cm²))" },
                        resultNote: { type: Type.STRING, description: "Ghi chú bước giải nếu có" },
                      },
                      required: ["stepNumber", "title", "calculation"],
                    },
                  },
                  finalAnswer: { type: Type.STRING, description: "Đáp số của bài toán kèm đơn vị" },
                  targetQuestionType: {
                    type: Type.STRING,
                    description: "area, perimeter, side, height, base, radius, diameter, compound, unit_conversion",
                  },
                  pedagogicalNote: {
                    type: Type.STRING,
                    description: "Lời khuyên sư phạm/lưu ý cho học sinh lớp 5",
                  },
                },
                required: [
                  "id",
                  "title",
                  "originalPrompt",
                  "shapeType",
                  "shapeParams",
                  "summary",
                  "solutionSteps",
                  "finalAnswer",
                ],
              },
            },
          },
          required: ["problems"],
        },
      },
    });

    const textOutput = response.text || "{}";
    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Solve error:", error);
    return res.status(500).json({
      error: error.message || "Đã xảy ra lỗi khi phân tích đề bài toán hình học bằng AI.",
    });
  }
});

// Vite middleware setup for Development or Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
