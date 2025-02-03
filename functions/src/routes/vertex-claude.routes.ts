import { Router } from 'express';
import type { RequestHandler } from 'express';
import { VertexClaudeService } from '../services/vertex-claude.service';
import { authMiddleware } from '../middleware/auth.middleware';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';

const router = Router();
const vertexService = VertexClaudeService.getInstance();

interface ReadingRequest {
  userInput: string;
  cards: DrawnTarotCard[];
  spreadInfo: SpreadInfo;
}

const handleReading: RequestHandler = async (req, res) => {
  try {
    const { userInput, cards, spreadInfo } = req.body as ReadingRequest;

    if (!userInput || !cards || !spreadInfo) {
      return res.status(400).json({
        error: '필수 정보가 누락되었습니다.',
        code: 'MISSING_PARAMETERS'
      });
    }

    const result = await vertexService.generateReading(userInput, cards, spreadInfo);
    return res.json(result);
  } catch (error) {
    console.error('Vertex Claude error:', error);

    if (error instanceof Error) {
      // Vertex API 에러인 경우
      const statusCode = (error as any).statusCode || 500;
      const vertexError = (error as any).vertexError;

      return res.status(statusCode).json({
        error: error.message,
        code: 'VERTEX_API_ERROR',
        vertexError // Vertex API의 원본 에러 정보
      });
    }

    return res.status(500).json({
      error: '알 수 없는 오류가 발생했습니다.',
      code: 'UNKNOWN_ERROR'
    });
  }
};

router.post('/', authMiddleware, handleReading);

export default router;
