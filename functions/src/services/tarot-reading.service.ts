import { AIService } from '../types/ai-service';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';

export class TarotReadingService {
  constructor(
    private primaryService: AIService,
    private fallbackService?: AIService
  ) {}

  async getReading(
    userInput: string,
    cards: DrawnTarotCard[],
    spreadInfo: SpreadInfo
  ) {
    try {
      return await this.primaryService.generateReading(userInput, cards, spreadInfo);
    } catch (error) {
      console.error('❌ Primary Service (Gemini) failed:', error instanceof Error ? error.message : 'Unknown error');

      if (this.fallbackService) {
        console.log('🔄 Switching to fallback service (Vertex Claude)...');
        try {
          return await this.fallbackService.generateReading(userInput, cards, spreadInfo);
        } catch (fallbackError) {
          console.error('❌ Fallback Service (Vertex Claude) also failed:',
            fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
          );
          throw fallbackError;
        }
      }

      throw error;
    }
  }
}
