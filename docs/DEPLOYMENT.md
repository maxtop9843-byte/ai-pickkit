# Deployment and Verification

## Environments

- Pull Request: Vercel Preview
- `main`: Vercel Production
- Canonical production domain: `https://aipickkit.com` (연결 전까지 pending)

## Required checks

- `quality`: format, lint, typecheck, tests, production build
- `Vercel`: 동일 PR head SHA의 Preview 배포
- `production-smoke`: 병합된 main SHA의 production 응답 및 공개 경로 검사

Vercel 프로젝트와 도메인을 연결한 뒤 실제 check 이름과 배포 webhook/API 상태를 이 문서에 기록한다. 연결 전에는 production 검증을 성공으로 표시하지 않는다.
