import * as functions from 'firebase-functions/v2';
import { initializeFirebaseAdmin } from './config';
import app from './app';

// Firebase Admin 초기화
initializeFirebaseAdmin();

// Secret Manager를 사용하도록 설정
export const auth = functions.https.onRequest(
  {
    secrets: ['SERVICE_ACCOUNT_KEY'],
  },
  app
);
