# AI PickKit Task Queue

상태 표시는 계획 보조용이다. 실제 상태는 `AUTOMATION.md`에 따라 GitHub PR, branch, checks와 production smoke를 대조해 판정한다.

| ID      | 상태 | 작업                                 | AUTO_MERGE | 완료 조건                                             |
| ------- | ---- | ------------------------------------ | ---------- | ----------------------------------------------------- |
| APK-000 | DONE | 프로젝트 및 자동화 기반 부트스트랩   | false      | main 초기 커밋과 로컬 check/build 성공                |
| APK-001 | DONE | 자동화 파이프라인 검증용 상태 페이지 | true       | CI, Preview, squash merge, production smoke 전체 성공 |
| APK-002 | DONE | 초보자용 AI API 비용 계산기          | true       | APK-001 production smoke 성공 후 eligible             |
| APK-003 | DONE | 모델 가격·특성 비교                  | true       | APK-002 production smoke 성공 후 eligible             |
| APK-004 | DONE | 목적 기반 모델 선택 도우미           | true       | APK-003 production smoke 성공 후 eligible             |

## 작업 선택 규칙

위에서 아래 순서로 첫 번째 `OPEN` 작업 하나만 선택한다. 선행 작업의 production smoke가 확인되지 않으면 `BLOCKED`를 열지 않는다.
