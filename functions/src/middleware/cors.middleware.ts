import * as cors from 'cors';
import { RequestHandler } from 'express';

export const corsMiddleware: RequestHandler = cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://moonstruck-b17d6.web.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
