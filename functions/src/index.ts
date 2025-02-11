import * as functions from 'firebase-functions/v2';
import { initializeFirebaseAdmin } from './config/firebase';
import app from './app';

export const api = functions.https.onRequest(
  {
    timeoutSeconds: 120,
    minInstances: 0,
    memory: '256MiB',
    cors: false,
  },
  async (req, res) => {
    try {
      await initializeFirebaseAdmin();
      return app(req, res);
    } catch (error) {
      console.error('Function initialization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
