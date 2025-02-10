import { GoogleGenerativeAI } from '@google/generative-ai';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';
import { AIService, AIServiceError } from '../types/ai-service';
import { formatReadingPrompt } from '../utils/promptFormatter';
import { getGeminiApiKey } from '../utils/loadSecrets'; // 기존 함수 사용
import { geminiPrompt } from '../data/prompts/gemini.prompt';
import type { AIResponse } from '../types/ai-service';

export class GeminiService implements AIService {
  private static instance: GeminiService;
  private static readonly MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
  private genAI!: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    const apiKey = await getGeminiApiKey();
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: GeminiService.MODEL_NAME });
  }

  public static async getInstance(): Promise<GeminiService> {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
      await GeminiService.instance.initialize();// 인스턴스 생성 시 초기화 대기
    }
    return GeminiService.instance;
  }

  async generateReading(
    userInput: string,
    cards: DrawnTarotCard[],
    spreadInfo: SpreadInfo
  ): Promise<AIResponse> {
    try {
      const formattedPrompt = formatReadingPrompt(userInput, cards, spreadInfo);
      console.log('🎭 Gemini Prompt:', formattedPrompt);// 프롬프트 확인

      const chat = this.model.startChat({
        history: [
          { role: 'user', parts: [{ text: geminiPrompt.system.input }] },
          { role: 'model', parts: [{ text: geminiPrompt.system.response }] }
        ]
      });

      const result = await chat.sendMessage(formattedPrompt);
      const response = await result.response;
      const responseText = response.text();

      console.log('✨ Gemini Response:', { // 응답 확인
        model: GeminiService.MODEL_NAME,
        content: responseText.slice(0, 100) + '...', // 응답 앞부분만 표시
        length: responseText.length
      });

      return {
        content: [{ text: responseText }],
        model: GeminiService.MODEL_NAME
      };
    } catch (error) {
      console.error('❌ Gemini API Error:', error instanceof Error ? error.message : 'Unknown error');
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AIServiceError {
    const serviceError = new Error(error.message) as AIServiceError;
    serviceError.statusCode = 500;// Gemini 에러 상태 코드 매핑 필요
    serviceError.geminiError = error;
    return serviceError;
  }
}
