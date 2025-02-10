import { AIService } from '../types/ai-service';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';

export class TarotReadingService {
  constructor(private aiService: AIService) {}

  async getReading(
    userInput: string,
    cards: DrawnTarotCard[],
    spreadInfo: SpreadInfo
  ) {
    return await this.aiService.generateReading(userInput, cards, spreadInfo);
  }
}
