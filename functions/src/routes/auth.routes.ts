import * as express from 'express';
import { KakaoService } from '../services/kakao.service';
import { FirebaseService } from '../services/firebase.service';

const router = express.Router();

router.get('/kakao', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'code is a required parameter.' });
  }

  try {
    const token = await KakaoService.getToken(code as string);
    const user = await KakaoService.getUser(token.access_token);

    // Firebase Custom Token 생성
    const firebaseToken = await FirebaseService.createCustomToken(user);

    return res.json({
      token,
      user,
      firebaseToken, // 응답에 Firebase Custom Token 추가
    });
  } catch (error) {
    console.error('Error in auth process:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

export default router;
