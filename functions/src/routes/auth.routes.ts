import * as express from 'express';
import { KakaoService } from '../services/kakao.service';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';

const router = express.Router();

router.get('/kakao', async (req, res) => {
  const { code, redirectUri } = req.query;

  if (!code || !redirectUri) {
    return res.status(400).json({
      error: 'Both code and redirectUri are required parameters.',
    });
  }

  try {
    const token = await KakaoService.getToken(
      code as string,
      redirectUri as string
    );
    const user = await KakaoService.getUser(token.access_token);

    // uid 생성
    const uid = `kakao:${user.id}`;

    // 유저 정보 저장 (크레딧 관리를 위해)
    await UserService.saveUser(uid);

    // Firebase Custom Token 생성
    const firebaseToken = await FirebaseService.createCustomToken(user);

    return res.json({
      token,
      user,
      firebaseToken,
    });
  } catch (error) {
    console.error('Error in auth process:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Authentication failed.',
    });
  }
});

export default router;
