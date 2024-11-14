import * as express from 'express';
import { KakaoService } from '../services/kakao.service';

const router = express.Router();

// '/kakao' 경로로 변경
router.get('/kakao', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'code is a required parameter.' });
  }

  try {
    const token = await KakaoService.getToken(code as string);
    return res.json({ token });
  } catch (error) {
    console.error('Error fetching token:', error);
    return res.status(500).json({ error: 'Failed to fetch token.' });
  }
});

export default router;
