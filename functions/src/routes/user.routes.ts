import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/info',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const uid = req.user.uid;

    try {
      const userInfo = await UserService.getUserInfo(uid);
      res.json(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }
);

export default router;
