import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { vertexClaudePrompt } from '../data/prompts/vertex-claude.prompt';
import { getVertexServiceAccountKey } from '../utils/loadSecrets';
import { formatReadingPrompt } from '../utils/promptFormatter';
import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';
import { AIService, AIServiceError, AIResponse } from '../types/ai-service';

export class VertexClaudeService implements AIService {
  private static instance: VertexClaudeService;
  private static readonly MODEL_NAME = 'claude-3-5-sonnet';
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private constructor() {}// private 생성자

  public static getInstance(): VertexClaudeService {
    if (!VertexClaudeService.instance) {
      VertexClaudeService.instance = new VertexClaudeService();
    }
    return VertexClaudeService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const serviceAccountKey = await getVertexServiceAccountKey();
    const credentials = JSON.parse(serviceAccountKey);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const response = await client.getAccessToken();

    if (!response.token) {
      throw new Error('Failed to get access token');
    }

    const oAuth2Client = client as OAuth2Client;
    const expiryDate = oAuth2Client.credentials.expiry_date;

    this.accessToken = response.token;
    this.tokenExpiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 3600000);

    return this.accessToken;
  }

  private createVertexClient(token: string) {
    return axios.create({
      baseURL: 'https://us-east5-aiplatform.googleapis.com',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  /* eslint-disable max-len */
  private getEndpointPath(): string {
    return `/v1/projects/moonstruck-1/locations/us-east5/publishers/anthropic/models/${VertexClaudeService.MODEL_NAME}@20240620:rawPredict`;
  }

  async generateReading(
    userInput: string,
    cards: DrawnTarotCard[],
    spreadInfo: SpreadInfo
  ): Promise<AIResponse> {
    try {
      const token = await this.getAccessToken();
      const client = this.createVertexClient(token);
      const formattedPrompt = formatReadingPrompt(userInput, cards, spreadInfo);

      console.log('🎭 Vertex Claude Prompt:', formattedPrompt);// 프롬프트 확인

      const response = await client.post(
        this.getEndpointPath(),
        {
          anthropic_version: 'vertex-2023-10-16',
          messages: [
            { role: 'user', content: vertexClaudePrompt.system.input },
            { role: 'assistant', content: vertexClaudePrompt.system.response },
            { role: 'user', content: formattedPrompt },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }
      );

      console.log('✨ Vertex Claude Response:', {
        model: VertexClaudeService.MODEL_NAME,
        content: response.data.content[0].text.slice(0, 100) + '...',
        length: response.data.content[0].text.length
      });

      return {
        content: response.data.content,
        model: VertexClaudeService.MODEL_NAME
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Vertex API Detailed Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            headers: error.config?.headers,
            method: error.config?.method,
          }
        });
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AIServiceError {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data?.error;

      const serviceError = new Error(errorData?.message || error.message) as AIServiceError;
      serviceError.statusCode = statusCode;
      serviceError.vertexError = errorData;
      return serviceError;
    }
    return error;
  }
}
