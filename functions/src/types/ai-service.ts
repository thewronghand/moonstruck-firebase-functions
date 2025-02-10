import { SpreadInfo } from './spread';
import { DrawnTarotCard } from './tarot';

export interface AIServiceError extends Error {
  statusCode?: number;
  vertexError?: any;
  geminiError?: any;
}

export interface AIService {
  generateReading(
    userInput: string,
    cards: DrawnTarotCard[],
    spreadInfo: SpreadInfo
  ): Promise<any>;
}
