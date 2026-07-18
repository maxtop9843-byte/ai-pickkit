# Deployment and Verification

## Environments

- Pull Request: Vercel Preview
- `main`: Vercel Production
- Canonical production domain: `https://aipickkit.com`

## Required checks

- `quality`: format, lint, typecheck, tests, production build
- `Vercel`: 동일 PR head SHA의 Preview 배포
- `production-smoke`: 병합된 main SHA의 production 응답 및 공개 경로 검사

Vercel 프로젝트는 GitHub 저장소와 연결돼 있으며 PR Preview와 `main` production 배포를 담당한다. `Production Smoke`는 배포 지연을 polling하고 공개 경로의 실제 응답을 검증한다.
