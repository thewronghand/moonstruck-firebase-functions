import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

// Secret 캐싱을 위한 객체
const secretsCache: Record<string, string> = {};

// Secret을 로드하는 함수 (필요할 때만 호출)
async function getSecret(secretName: string): Promise<string> {
  // 캐시된 값이 있다면 반환
  if (secretsCache[secretName]) {
    return secretsCache[secretName];
  }

  // Secret Manager에서 값 가져오기
  const [version] = await client.accessSecretVersion({
    name: `projects/moonstruck-b17d6/secrets/${secretName}/versions/latest`,
  });

  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Failed to load secret: ${secretName}`);
  }

  // 캐시에 저장
  secretsCache[secretName] = payload;

  return payload;
}

export async function getKakaoRestApiKey(): Promise<string> {
  return getSecret('KAKAO_REST_API_KEY');
}

export async function getServiceAccountKey(): Promise<string> {
  return getSecret('SERVICE_ACCOUNT_KEY');
}

export async function getVertexServiceAccountKey(): Promise<string> {
  return getSecret('VERTEX_AI_SERVICE_ACCOUNT_KEY');
}
