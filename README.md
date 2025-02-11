# moonstruck-firebase-functions

moonstruck 서비스의 서버리스 백엔드입니다. LLM 모델 연동, 프롬프트 처리, DB 관리 등을 담당합니다.

## 주요 기능

- [X] LLM 모델 연동:
  - Gemini Pro를 주 모델로 사용
  - Claude 3.5 Sonnet을 폴백 모델로 활용
  - 자동 모델 전환 로직

- [X] 프롬프트 처리:
  - 타로 카드 해석을 위한 프롬프트 포매팅
  - 스프레드별 맞춤 프롬프트 제공

- [X] DB 관리:
  - 타로 리딩 결과 저장
  - 공유 URL을 위한 문서 ID 생성
  - 결과 조회 API 제공

## 기술 스택

- Firebase Functions
- TypeScript
- Express
- Google Gemini Pro (@google/generative-ai)
- Google Vertex AI
- Google Secret Manager
- Firebase Admin
- Axios
- ESLint

## 작동 원리

1. API 요청 처리:
   - 클라이언트로부터 질문, 카드 정보, 스프레드 정보를 수신
   - 요청 데이터 검증 및 포매팅

2. LLM 처리:
   - Gemini Pro로 타로 해석 시도
   - 실패 시 자동으로 Claude로 전환
   - 해석 결과 반환

3. DB 처리:
   - 해석 결과 및 관련 정보 Firestore에 저장
   - 문서 ID 생성 및 반환
   - 공유 URL을 통한 조회 지원

## 향후 추가 기능

- 선택적 로그인 지원
- 사용자별 결과 히스토리 관리
- 오늘의 운세 API
- 캐릭터별 프롬프트 시스템

## 관련 프로젝트

- [moonstruck](https://github.com/thewronghand/moonstruck): 웹 클라이언트
