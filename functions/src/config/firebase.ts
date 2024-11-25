import * as admin from 'firebase-admin';
import { getServiceAccountKey } from '../utils/loadSecrets';

export async function initializeFirebaseAdmin(): Promise<
  admin.app.App | undefined
> {
  try {
    if (!admin.apps.length) {
      const serviceAccountKey = await getServiceAccountKey();
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
        projectId: 'moonstruck-b17d6',
      });
      console.log('Firebase Admin initialized successfully');
    }
    return admin.app();
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return undefined;
  }
}
