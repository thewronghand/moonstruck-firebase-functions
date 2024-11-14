import * as express from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import authRoutes from './routes/auth.routes';

const app = express();

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Headers:', req.headers);
  next();
});

app.use(corsMiddleware);
app.use(express.json());

// 라우터를 루트 경로에 연결
app.use('/', authRoutes);

// 404 에러 핸들링
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

export default app;
