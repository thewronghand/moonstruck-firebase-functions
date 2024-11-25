import axios from 'axios';
import { TokenResponse, KakaoUser } from '../types';
import { getKakaoRestApiKey } from '../utils/loadSecrets';

export class KakaoService {
  static async getToken(
    code: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    const kakaoRestApiKey = await getKakaoRestApiKey();

    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoRestApiKey,
      redirect_uri: redirectUri,
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
      throw new Error(
        error.response?.data?.error_description || 'Failed to fetch token'
      );
    }
  }

  static async getUser(accessToken: string): Promise<KakaoUser> {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Kakao User Info:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Kakao User Info Error:',
        error.response?.data || error.message
      );
      throw new Error('Failed to fetch user info.');
    }
  }
}
