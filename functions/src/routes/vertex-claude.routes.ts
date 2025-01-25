import { Router } from 'express';
import type { RequestHandler } from 'express';
import { VertexClaudeService } from '../services/vertex-claude.service';
import { authMiddleware } from '../middleware/auth.middleware';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadType } from '../types/spread';

const router = Router();
const vertexService = VertexClaudeService.getInstance();

interface ReadingRequest {
  userInput: string;
  cards: DrawnTarotCard[];
  spreadType: SpreadType;
}

const handleReading: RequestHandler = async (req, res) => {
  try {
    const { userInput, cards, spreadType } = req.body as ReadingRequest;

    if (!userInput || !cards || !spreadType) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const result = await vertexService.generateReading(userInput, cards, spreadType);
    return res.json(result);
  } catch (error) {
    console.error('Vertex Claude error:', error);
    return res.status(500).json({
      error: '처리 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
};

router.post('/', authMiddleware, handleReading);

export default router;
