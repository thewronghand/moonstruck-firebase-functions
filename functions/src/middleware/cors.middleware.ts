import * as cors from 'cors';
import { RequestHandler } from 'express';

export const corsMiddleware: RequestHandler = cors({ origin: true });
