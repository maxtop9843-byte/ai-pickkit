# AI PickKit Automation Contract

이 문서는 예약 실행, 사람, AI 작업자 모두가 따라야 하는 영구 규칙이다. GitHub 원격 상태가 유일한 작업 상태 기준이다.

## 1. 시작 조건

1. `git fetch origin --prune`을 실행한다.
2. 최신 `origin/main`에서 매번 새 worktree와 새 브랜치를 만든다.
3. 기존 작업 폴더, 브랜치, rebase 상태를 이어받지 않는다.
4. 한 실행에서는 정확히 하나의 eligible task만 처리한다. 여기서 task는 파일 수정 조각이 아니라 사용자에게 전달 가능한 하나의 완료 결과를 뜻한다.
5. 아래 중 하나라도 해당하면 새 구현 작업을 시작하지 않는다.
   - 열린 PR 본문에 독립된 줄 `AUTO_MERGE: true`가 있다.
   - 최신 `main`의 production smoke가 애플리케이션 코드 오류로 failed다.
   - 다른 자동화 실행이 GitHub concurrency lock을 보유한다.
6. 최신 main이 외부 플랫폼 제한 때문에 아직 Production에 반영되지 않은 경우에는 전체 개발을 정지하지 않는다. 해당 작업을 `MERGED_PENDING_PRODUCTION`으로 판정하고 다음 eligible task를 Draft PR 단계까지 진행할 수 있다. 단, pending 작업의 Production 검증이 끝나기 전에는 후속 PR을 병합하지 않는다.
7. GitHub, Vercel 또는 작업에 필요한 연결 도구가 제공되면 불가능하다고 판단하기 전에 반드시 실제 도구 호출을 먼저 시도한다.
8. GitHub 상태는 저장소 파일, PR, branch, checks와 workflow를 GitHub 연결 도구로 조회하고, Vercel 상태는 project, deployment, build log, Preview와 production URL을 Vercel 연결 도구로 조회한다.
9. 첫 호출이 실패하거나 결과가 비어 있어도 즉시 불가 판정하지 않는다. 저장소명, project slug, team ID, deployment URL, 권한 범위와 대체 조회 경로를 확인해 합리적인 범위에서 재시도한다.
10. 도구를 실제로 시도한 뒤에도 진행할 수 없을 때만 차단으로 보고하며, 사용한 도구, 호출 대상, 반환된 오류 또는 누락된 권한을 구체적으로 기록한다. 추측만으로 `접근할 수 없다`, `권한이 없다`, `검증할 수 없다`고 보고하지 않는다.

## 2. 작업 상태 판정

`TASK_QUEUE.md`만 믿지 말고 task ID를 기준으로 merged PR, open/draft PR, closed-unmerged PR, local/remote branch, 중단된 merge/rebase/cherry-pick와 Production 반영 상태를 대조한다.

- merged PR이 있고 동일 SHA의 Production smoke 성공: `DONE`
- merged PR이 있으나 외부 플랫폼 제한 때문에 동일 SHA Production이 아직 생성되지 않음: `MERGED_PENDING_PRODUCTION`
- open 또는 draft PR 존재: `IN_REVIEW`
- 복구 가능한 branch만 존재: `IN_PROGRESS`
- PR과 복구 가능한 branch가 없고 queue가 OPEN: `OPEN`

동일 task ID의 브랜치나 PR을 중복 생성하지 않는다. `MERGED_PENDING_PRODUCTION`은 새 구현이 필요한 `OPEN`이나 사람 개입이 필요한 `BLOCKED`로 취급하지 않는다.

## 3. 구현 및 복구

- 선택 작업 범위 안에서만 수정한다.
- formatter, lint, typecheck, test, registry, route, redirect, import, build, stale output 오류는 원인을 수정하고 같은 실행에서 재검증한다.
- commit 또는 push 전에 반드시 formatter를 포함한 전체 로컬 검증을 끝낸다. 원격 CI를 포맷터 시행착오 도구로 사용하지 않는다.
- rebase나 공유 파일 충돌은 중단 사유가 아니다. 최신 `origin/main`, 공통 조상, 작업 브랜치를 비교해 최신 main을 보존하고 선택 작업만 다시 적용한다.
- 공유 registry, navigation, redirects, sitemap, robots, metadata, tests, package files, 공통 UI와 설정은 additive minimal diff로 수정한다.
- 테스트를 삭제하거나 약화해 통과시키지 않는다.
- 장시간 명령은 종료 상태까지 polling한다.
- 큐 상태 변경, 보고서 작성, 재배포 유도만을 위한 독립 PR이나 런타임 비영향 커밋을 만들지 않는다. 해당 기록은 다음 실제 구현 PR에 함께 반영하거나 GitHub PR 본문·댓글에 남긴다.

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

### 실제 시각 검증 원칙

UI 변경은 Preview 또는 Production 웹에 브라우저로 직접 접속해 눈으로 보고 조작하는 검증을 기본으로 한다. 렌더된 HTML, CSS 규칙, 접근성 속성 검사는 브라우저 접근이 실제로 불가능할 때만 보조 근거로 사용한다.

브라우저 검증에서는 최소한 다음을 확인한다.

- 데스크톱과 모바일 viewport에서 화면 캡처 또는 동등한 시각 기록
- 라이트·다크 전환, 새로고침 후 저장 복원, 시스템 테마 기본값
- 주요 입력, 계산, 결과, 비교, 공유, 저장, URL 복원
- 헤더·표·카드·버튼·입력창의 넘침, 잘림, 대비와 시각적 일관성
- 키보드 포커스, 터치 크기, 오류·빈 상태
- 콘솔 오류와 치명적 네트워크 오류

보호된 Preview는 Vercel 인증 접근, deployment URL, 가능한 fetch 또는 브라우저 자동화 경로를 순서대로 시도한다. Preview가 외부 사유로 막혔지만 코드 검증이 성공하면 병합 예외를 적용할 수 있으나, 병합 후 Production 웹 직접 검증은 생략하지 않는다.

## 6. PR과 병합

검증 성공 후에만 commit, push, PR 생성을 수행한다. 브랜치명과 commit/PR 제목에 task ID를 넣는다.

자동 병합 대상 PR 본문에는 아래 문구를 정확한 독립 줄로 한 번만 넣는다.

```text
AUTO_MERGE: true
```

기본 자동 병합 조건은 base가 `main`, 동일 저장소의 non-draft 기능 브랜치, 정확한 opt-in, 같은 head SHA의 GitHub CI 및 Vercel Preview 성공, 충돌 없음, 보호 규칙 차단 없음이다. 조건이 충족되면 squash 방식으로 병합한다.

Preview 브라우저 검증은 우선 수행하되 외부 사유로 불가능한 경우 절대 병합 차단 조건으로 고정하지 않는다. 다음 조건을 모두 충족하면 Preview 실패 도구, 대상, 오류와 재시도 결과를 기록한 뒤 squash 병합을 계속한다.

- exact-head GitHub CI/checks가 성공했다.
- `npm run check`, `npm run build`, `git diff --check`가 모두 성공했다.
- 변경 diff와 테스트에서 보안, 계산, 경로, 데이터 손실 또는 치명적 UX 문제가 발견되지 않았다.
- Preview 불가 원인이 Vercel 무료 배포 한도, 보호 정책, 관리자 차단, DNS, timeout, connection reset, 실행 환경 네트워크 또는 브라우저 도구 제한이다.

Preview build가 애플리케이션 코드 오류로 실패한 경우에는 이 예외를 적용하지 않는다.

Preview 예외로 병합한 경우 병합 직후 Production deployment READY 확인과 canonical 웹 직접 검증을 최우선으로 수행한다. 홈페이지와 대상 경로에서 핵심 입력, 계산, 결과, 공유·저장·URL 복원, 모바일, 접근성, 시각적 일관성을 확인한다. Production에서 실제 결함이 발견되면 다음 작업을 시작하지 말고 같은 작업의 수정 PR 또는 최소 롤백으로 복구한다.

## 7. 병합 후 게이트와 2차선 운영

병합 후 동일 SHA의 Production deployment가 생성되면 READY까지 확인하고 canonical domain에서 홈페이지, 주요 공개 경로, sitemap, robots, 핵심 기능, 404와 서버 오류를 검사한다.

Production 배포가 애플리케이션 코드 오류로 실패한 경우에는 다음 작업을 시작하지 않는다. 반면 무료 배포 한도, 보호 정책, 관리자 차단, DNS, timeout, connection reset, 실행 환경 네트워크 등 외부 플랫폼 제한으로 생성되지 않은 경우에는 해당 작업을 `MERGED_PENDING_PRODUCTION`으로 기록하고 다음 eligible task의 구현과 Draft PR 생성까지 진행할 수 있다.

2차선 운영 규칙은 다음과 같다.

- 개발 레인: 다음 task를 구현하고 로컬 검증 후 Draft PR까지 생성할 수 있다.
- 배포 레인: pending task의 동일 SHA Production 생성과 canonical smoke를 계속 확인한다.
- pending task가 DONE 되기 전에는 후속 Draft PR을 ready 전환하거나 병합하지 않는다.
- pending task의 Production에서 실제 결함이 발견되면 후속 작업보다 수정 PR 또는 최소 롤백을 우선한다.
- 동일 상태를 확인하기 위한 빈 실행을 반복하지 않는다. 한 번 확인 후 변화가 없으면 다음 개발 레인의 실질 작업을 진행한다.

Production 배포가 무료 배포 한도나 외부 플랫폼 제한으로 생성되지 않았고 애플리케이션 코드 오류가 아닌 경우, 아래 조건을 모두 만족하면 동일 애플리케이션 아티팩트의 READY Preview를 제한적 대체 게이트로 사용할 수 있다.

- READY Preview의 커밋과 최신 `main` 사이 변경 파일이 `docs/`, `reports/`, `TASK_QUEUE.md`, `AUTOMATION.md` 등 런타임 비영향 파일뿐임을 commit compare로 확인한다.
- Preview에서 홈페이지와 대상 경로 HTTP 200, canonical, 핵심 입력·결과·공유·저장·URL 복원, 모바일·접근성·시각 일관성을 브라우저로 직접 확인한다.
- 현재 canonical Production이 HTTP 200이며 최근 runtime error 또는 fatal cluster가 없다.
- 사용한 Preview deployment ID·SHA, 최신 main SHA, 변경 파일 비교, Production 미생성 원인과 검증 한계를 기록한다.

이 대체 게이트는 런타임 코드, 의존성, 빌드 설정, 환경 변수, 공개 경로, 가격·정책 데이터가 Preview 이후 변경된 경우 적용하지 않는다. 이후 최신 main Production이 생성되면 다음 실행에서 다시 canonical smoke를 수행하며, 결함이 발견되면 새 작업보다 수정 또는 최소 롤백을 우선한다.

배포 후 새로 발생한 치명적 오류, 잘못된 계산, 데이터 손실, 핵심 흐름 차단, 전체 페이지 5xx, 심각한 모바일·접근성 퇴행이 확인되면 다음 작업을 열지 않는다. 원인이 명확하고 안전하면 같은 작업에서 수정 PR을 만들고, 즉시 복구가 필요하면 마지막 정상 main으로 되돌리는 최소 롤백을 우선한다. 롤백과 후속 수정 모두 원인, 영향 경로와 검증 결과를 기록한다.

진행 중이라는 보고만 남기고 종료하지 않는다. 성공 상태, `MERGED_PENDING_PRODUCTION`에 따른 다음 개발 레인 진행, 또는 진짜 차단 사유를 근거와 함께 남긴다.
