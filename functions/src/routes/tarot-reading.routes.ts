import { Router } from 'express';
import type { RequestHandler } from 'express';
import { TarotReadingService } from '../services/tarot-reading.service';
import { GeminiService } from '../services/gemini.service';
import { VertexClaudeService } from '../services/vertex-claude.service';
import { authMiddleware } from '../middleware/auth.middleware';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';
import { AIServiceError } from '../types/ai-service';

const router = Router();
let tarotReadingService: TarotReadingService;

// 서비스 초기화 함수
async function initializeServices() {
  const geminiService = await GeminiService.getInstance();
  const vertexService = await VertexClaudeService.getInstance();
  tarotReadingService = new TarotReadingService(
    geminiService, // Primary
    vertexService // Fallback
  );
}

interface ReadingRequest {
  userInput: string;
  cards: DrawnTarotCard[];
  spreadInfo: SpreadInfo;
}

const handleReading: RequestHandler = async (req, res) => {
  if (!tarotReadingService) {
    await initializeServices();
  }

  try {
    const { userInput, cards, spreadInfo } = req.body as ReadingRequest;

    if (!userInput || !cards || !spreadInfo) {
      return res.status(400).json({
        error: '필수 정보가 누락되었습니다.',
        code: 'MISSING_PARAMETERS'
      });
    }

    const result = await tarotReadingService.getReading(userInput, cards, spreadInfo);
    return res.json(result);
  } catch (error: unknown) {
    // 모델별 에러 타입 체크
    if (error instanceof Error) {
      const aiError = error as AIServiceError;

      if (aiError.vertexError) {
        // Vertex Claude 에러 처리
        return res.status(aiError.statusCode || 500).json({
          error: aiError.message,
          code: 'VERTEX_API_ERROR',
          vertexError: aiError.vertexError
        });
      }

      if (aiError.geminiError) {
        // Gemini 에러 처리
        return res.status(500).json({
          error: aiError.message,
          code: 'GEMINI_API_ERROR',
          geminiError: aiError.geminiError
        });
      }

      // 일반 Error 객체인 경우
      return res.status(500).json({
        error: aiError.message,
        code: 'UNKNOWN_ERROR'
      });
    }

    // Error 객체가 아닌 경우
    return res.status(500).json({
      error: '알 수 없는 오류가 발생했습니다.',
      code: 'UNKNOWN_ERROR'
    });
  }
};

router.post('/', authMiddleware, handleReading);

export default router;
