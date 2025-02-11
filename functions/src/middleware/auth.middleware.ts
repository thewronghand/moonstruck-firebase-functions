import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // 인증 헤더가 없는 경우 게스트로 처리
  if (!authHeader?.startsWith('Bearer ')) {
    req.user = { uid: 'guest' };
    next();
    return;
  }

  // 인증 헤더가 있는 경우 토큰 검증 시도
  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.warn('Token verification failed, proceeding as guest:', error);
    req.user = { uid: 'guest' };
    next();
  }
};
