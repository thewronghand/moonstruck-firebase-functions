import axios from 'axios';
import { TokenResponse } from '../types/auth';
import { kakaoConfig } from '../config';

export class KakaoService {
  static async getToken(code: string): Promise<TokenResponse> {
    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoConfig.restApiKey,
      redirect_uri: kakaoConfig.redirectUri,
      code,
    };

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
  }
}
