import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { vertexClaudePrompt } from '../data/prompts/vertex-claude.prompt';
import { getServiceAccountKey } from '../utils/loadSecrets';

export class VertexClaudeService {
  private static instance: VertexClaudeService;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private constructor() {}

  public static getInstance(): VertexClaudeService {
    if (!this.instance) {
      this.instance = new VertexClaudeService();
    }
    return this.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const serviceAccountKey = await getServiceAccountKey();
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

    // OAuth2Client로 타입 캐스팅
    const oAuth2Client = client as OAuth2Client;
    const expiryDate = oAuth2Client.credentials.expiry_date;

    this.accessToken = response.token;
    this.tokenExpiry = expiryDate? new Date(expiryDate): new Date(Date.now() + 3600000);

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

  private getEndpointPath(): string {
    return '/v1/projects/moonstruck-1/locations/us-east5/publishers/google/models/claude-3-sonnet-20240229:rawPredict';
  }

  async generateReading(query: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const client = this.createVertexClient(token);

      const response = await client.post(
        this.getEndpointPath(),
        {
          anthropic_version: 'vertex-2023-10-16',
          messages: [
            { role: 'user', content: vertexClaudePrompt.system.input },
            { role: 'assistant', content: vertexClaudePrompt.system.response },
            { role: 'user', content: query },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }
      );

      return response.data;
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

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage =
        error.response?.data?.error?.message || error.message;

      switch (statusCode) {
      case 401:
        return new Error(
          '인증 오류가 발생했습니다. 서비스 계정 키를 확인해주세요.'
        );
      case 403:
        return new Error(
          '권한이 없습니다. 서비스 계정의 권한을 확인해주세요.'
        );
      case 429:
        return new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      default:
        return new Error(`API 오류: ${errorMessage}`);
      }
    }

    return error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.');
  }
}
