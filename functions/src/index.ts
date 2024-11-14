import * as functions from 'firebase-functions';
import app from './app';

// auth 함수 export
export const auth = functions.https.onRequest(app);
