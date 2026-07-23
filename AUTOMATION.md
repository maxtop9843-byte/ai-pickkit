# AI PickKit Automation Contract

이 문서는 예약 실행, 사람, AI 작업자 모두가 따라야 하는 영구 규칙이다. GitHub 원격 상태가 유일한 작업 상태 기준이다.

## 1. 시작 조건

1. `git fetch origin --prune`을 실행한다.
2. 최신 `origin/main`에서 매번 새 worktree와 새 브랜치를 만든다.
3. 기존 작업 폴더, 브랜치, rebase 상태를 이어받지 않는다.
4. 한 실행에서는 정확히 하나의 eligible task만 처리한다.
5. 아래 중 하나라도 해당하면 새 작업을 시작하지 않는다.
   - 열린 PR 본문에 독립된 줄 `AUTO_MERGE: true`가 있다.
   - 최신 `main`의 production smoke가 pending 또는 failed다.
   - 다른 자동화 실행이 GitHub concurrency lock을 보유한다.

## 2. 작업 상태 판정

`TASK_QUEUE.md`만 믿지 말고 task ID를 기준으로 merged PR, open/draft PR, closed-unmerged PR, local/remote branch, 중단된 merge/rebase/cherry-pick를 대조한다.

- merged PR 존재: `DONE`
- open 또는 draft PR 존재: `IN_REVIEW`
- 복구 가능한 branch만 존재: `IN_PROGRESS`
- PR과 복구 가능한 branch가 없고 queue가 OPEN: `OPEN`

동일 task ID의 브랜치나 PR을 중복 생성하지 않는다.

## 3. 구현 및 복구

- 선택 작업 범위 안에서만 수정한다.
- formatter, lint, typecheck, test, registry, route, redirect, import, build, stale output 오류는 원인을 수정하고 같은 실행에서 재검증한다.
- rebase나 공유 파일 충돌은 중단 사유가 아니다. 최신 `origin/main`, 공통 조상, 작업 브랜치를 비교해 최신 main을 보존하고 선택 작업만 다시 적용한다.
- 공유 registry, navigation, redirects, sitemap, robots, metadata, tests, package files, 공통 UI와 설정은 additive minimal diff로 수정한다.
- 테스트를 삭제하거나 약화해 통과시키지 않는다.
- 장시간 명령은 종료 상태까지 polling한다.

진짜 차단 사유는 인증·권한 부재, 필수 외부 서비스의 장기 장애, 모순된 요구사항, 필요한 커밋 부재, 작업 밖의 대규모 변경, 허가되지 않은 파괴적 작업뿐이다.

## 4. 보안·개인정보·비용 안전장치

- API 키, 토큰, 비밀번호, 쿠키, 개인 식별 정보, 실제 사용자 입력과 비공개 URL을 코드, 로그, PR, 테스트 fixture, 스크린샷에 넣지 않는다.
- 외부 입력, URL 파라미터, 저장 데이터는 검증·정규화하고 HTML 또는 스크립트로 신뢰하지 않는다.
- 새로운 분석, 쿠키, 외부 스크립트, 사용자 데이터 저장은 개인정보 최소화 원칙과 Privacy 문서에 맞아야 한다.
- 도메인, DNS, 결제, 유료 플랜, 광고 계정, Vercel 프로젝트 설정, 환경 변수, GitHub 권한, 보호 규칙을 사용자 승인 없이 생성·삭제·변경하지 않는다.
- 대규모 의존성 교체, 프레임워크 메이저 업그레이드, 데이터 삭제, 기록 재작성과 강제 push는 별도 승인 없이는 금지한다.
- 새로운 패키지는 기능상 필요하고 기존 의존성으로 해결할 수 없을 때만 추가하며, 유지보수 상태와 라이선스를 확인한다.

## 5. 필수 검증

의존성이 없으면 저장소 lockfile로 `npm ci`를 실행한다. 다음을 모두 통과해야 한다.

```bash
npm run check
npm run build
git diff --check
```

`npm run check`는 formatter, lint, typecheck, unit/integration 검증을 포함한다. 기능에 따라 route, metadata/SEO, sitemap, 핵심 UI 테스트를 추가한다.

UI 또는 공개 경로 변경 시 다음 퇴행도 확인한다.

- 주요 경로의 HTTP 상태와 canonical URL
- 모바일 320px 이상에서 가로 넘침과 터치 불가 요소 없음
- 키보드 포커스, 레이블, 대비와 오류 안내
- 불필요한 대형 클라이언트 번들, 렌더링 차단 외부 스크립트와 명백한 성능 퇴행 없음
- 기존 핵심 사용자 흐름과 공유 URL 복원 기능 유지

## 6. PR과 병합

검증 성공 후에만 commit, push, PR 생성을 수행한다. 브랜치명과 commit/PR 제목에 task ID를 넣는다.

자동 병합 대상 PR 본문에는 아래 문구를 정확한 독립 줄로 한 번만 넣는다.

```text
AUTO_MERGE: true
```

자동 병합은 base가 `main`, 동일 저장소의 non-draft 기능 브랜치, 정확한 opt-in, 같은 head SHA의 GitHub CI 및 Vercel Preview 성공, 충돌 없음, 보호 규칙 차단 없음이 모두 확인된 경우에만 squash 방식으로 수행한다.

## 7. 병합 후 게이트와 복구

병합 후 production 배포 완료를 기다린 뒤 canonical domain에서 홈페이지, 주요 공개 경로, sitemap, robots, 핵심 기능, 404와 서버 오류를 검사한다. production smoke 성공 전에는 다음 작업을 시작하지 않는다.

배포 후 새로 발생한 치명적 오류, 잘못된 계산, 데이터 손실, 핵심 흐름 차단, 전체 페이지 5xx, 심각한 모바일·접근성 퇴행이 확인되면 다음 작업을 열지 않는다. 원인이 명확하고 안전하면 같은 작업에서 수정 PR을 만들고, 즉시 복구가 필요하면 마지막 정상 main으로 되돌리는 최소 롤백을 우선한다. 롤백과 후속 수정 모두 원인, 영향 경로와 검증 결과를 기록한다.

진행 중이라는 보고만 남기고 종료하지 않는다. 성공 상태 또는 진짜 차단 사유를 근거와 함께 남긴다.
