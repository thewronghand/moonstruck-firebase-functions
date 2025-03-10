// LLM 응답에서 content와 title을 추출하는 함수

export function parseAIResponse(response: string): { content: string; title: string } {
  // 정규식으로 content와 title 추출 (s 플래그 대신 [\s\S]* 사용)
  const contentMatch = response.match(/<content>([\s\S]*?)<\/content>/);
  const titleMatch = response.match(/<title>([\s\S]*?)<\/title>/);

  // 기본값 설정 (파싱 실패 시)
  const content = contentMatch ? contentMatch[1].trim() : response;
  const title = titleMatch ? titleMatch[1].trim() : '타로 해석 결과';

  return { content, title };
}
