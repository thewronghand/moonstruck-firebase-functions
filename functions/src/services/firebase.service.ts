import * as admin from 'firebase-admin';
import { KakaoUser } from '../types';

export class FirebaseService {
  static async createCustomToken(kakaoUser: KakaoUser): Promise<string> {
    try {
      // kakao: prefix를 사용하여 UID 생성
      const uid = `kakao:${kakaoUser.id}`;

      // Custom Claims 설정
      const customClaims = {
        provider: 'kakao',
        kakaoId: kakaoUser.id,
      };

      // Firebase Custom Token 생성
      const customToken = await admin
        .auth()
        .createCustomToken(uid, customClaims);
      return customToken;
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw new Error('Failed to create Firebase custom token');
    }
  }
}
