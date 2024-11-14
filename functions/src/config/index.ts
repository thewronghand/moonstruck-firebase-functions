import { config } from 'dotenv';
config();

export const kakaoConfig = {
  restApiKey: process.env.KAKAO_REST_API_KEY || '',
  redirectUri: process.env.KAKAO_REDIRECT_URI || '',
};
