import axios from 'axios';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { config } from 'dotenv';
config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // 요청 본문 JSON 파싱

interface TokenResponse {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

// 카카오 API로 토큰 요청 함수
const getTokenFromKakao = async (code: string): Promise<TokenResponse> => {
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY || '',
    redirect_uri: process.env.KAKAO_REDIRECT_URI || '',
    code,
  };
  console.log('KAKAO_REST_API_KEY:', process.env.KAKAO_REST_API_KEY);
  console.log('KAKAO_REDIRECT_URI:', process.env.KAKAO_REDIRECT_URI);

  try {
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams(body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('Kakao API Response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Kakao API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch token.');
  }
};

// GET 요청 핸들러 추가
app.get('/kakao', async (req, res) => {
  const { code } = req.query; // 쿼리 매개변수에서 'code' 추출

  if (!code) {
    return res.status(400).json({ error: 'code is a required parameter.' });
  }

  try {
    // 카카오 API로 토큰 요청
    const token = await getTokenFromKakao(code as string);

    // 성공적으로 액세스 토큰 반환
    return res.json({ token });
  } catch (error) {
    console.error('Error fetching token:', error);
    return res.status(500).json({ error: 'Failed to fetch token.' });
  }
});

// Firebase Functions로 Express 앱 설정
exports.auth = functions.https.onRequest(app);
