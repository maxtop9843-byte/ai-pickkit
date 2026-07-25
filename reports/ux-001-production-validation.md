# UX-001 Production Validation

## Scope

- 홈 첫인상에서 Pickkit이 단일 계산기가 아니라 비용 계산, 모델 비교, 모델 추천, 예산 계획 도구 모음임을 인지할 수 있어야 한다.
- 첫 화면 또는 첫 스크롤 안에서 대표 도구 진입점과 전체 도구 탐색 경로를 제공한다.
- 공개 UI에 내부 작업 ID를 노출하지 않는다.

## Implemented state

- 히어로를 AI 비용·모델 의사결정 도구 포지셔닝으로 변경했다.
- `비용 계산 시작`과 `모든 도구 보기` 경로를 제공한다.
- 대표 도구 6개와 전체 독립 도구 수를 홈 상단에 노출한다.
- 모바일에서는 CTA와 도구 목록을 단일 열로 전환하고 44px 터치 높이를 유지한다.
- 키보드 focus-visible, reduced motion, overflow 방지 규칙을 유지한다.

## Validation gate

이 문서는 Vercel build-rate-limit로 누락된 Preview 및 production 배포를 다시 발생시키기 위한 검증 기록이다. 같은 head의 CI와 Preview가 성공하고, squash 병합 후 canonical production에서 공개 화면이 확인된 경우에만 UX-001을 DONE으로 전환한다.
