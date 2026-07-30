# UX-002C Production Retry — 2026-07-30

## 목적

Vercel 무료 일일 배포 한도로 생성되지 않았던 `UX-002C` 병합 커밋의 Production 배포를 제한 초기화 이후 다시 유도하고, exact-head Preview와 Production 검증 근거를 남긴다.

## 기준 커밋

- `main`: `171cb08015a59f10b6d18af1cc2e649081482df2`
- 실제 UI 변경: 전역 `focus-visible`, coarse pointer 44px 최소 터치 높이, `prefers-reduced-motion` 대응

## 검증 게이트

- exact-head GitHub CI/checks
- `npm run check`
- `npm run build`
- `git diff --check`
- 동일 SHA Vercel Preview 또는 `AUTOMATION.md`의 외부 제한 예외 근거
- 병합 커밋 Production READY
- canonical domain과 주요 도구 경로의 HTTP, 모바일, 키보드 초점, 터치, reduced-motion, 접근성 검증

이 파일은 애플리케이션 동작, 가격 데이터, 계산식 또는 공개 경로를 변경하지 않는다.
