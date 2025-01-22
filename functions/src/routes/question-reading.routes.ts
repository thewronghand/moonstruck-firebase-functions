import { Router, Request, Response } from 'express';
import { QuestionReadingRepositoryService } from '../services/question-reading-repository.service';

const router = Router();

router.post('/save', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, cards, interpretation } = req.body;

    if (!question || !cards || !interpretation) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'Question, cards, and interpretation are required'
      });
      return;
    }

    const readingId = await QuestionReadingRepositoryService.saveReading({
      question,
      cards,
      interpretation
    });

    res.json({ readingId });
  } catch (error) {
    console.error('Error in save question reading route:', error);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

router.get('/get/:readingId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { readingId } = req.params;

    if (!readingId) {
      res.status(400).json({
        error: 'Reading ID is required'
      });
      return;
    }

    const reading = await QuestionReadingRepositoryService.getReading(readingId);

    if (!reading) {
      res.status(404).json({
        error: 'Reading not found',
        details: 'The requested reading does not exist'
      });
      return;
    }

    res.json(reading);
  } catch (error) {
    console.error('Error in get question reading route:', error);
    res.status(500).json({ error: 'Failed to get reading' });
  }
});

export default router;
