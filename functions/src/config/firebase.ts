import * as admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  try {
    // 프로덕션 환경용 코드 (Secret Manager 사용)
    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY || '');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      });
    }

    return admin.app();
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}
