import * as express from 'express';
import * as cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Express 미들웨어 설정
app.use(cors()); // 기본 CORS 설정
app.use(express.json());

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 404 에러 핸들러
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

// 에러 핸들러
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
);

export default app;
