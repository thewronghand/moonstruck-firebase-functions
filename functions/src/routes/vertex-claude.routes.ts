import { Router } from 'express';
import type { RequestHandler } from 'express';
import { VertexClaudeService } from '../services/vertex-claude.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const vertexService = VertexClaudeService.getInstance();

interface ReadingRequest {
  query: string;
}

const handleReading: RequestHandler = async (req, res) => {
  try {
    const { query } = req.body as ReadingRequest;

    if (!query) {
      return res.status(400).json({ error: '질문이 누락되었습니다.' });
    }

    const result = await vertexService.generateReading(query);
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
