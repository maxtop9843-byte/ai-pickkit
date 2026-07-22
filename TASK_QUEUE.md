# AI PickKit Task Queue

상태 표시는 계획 보조용이다. 실제 상태는 `AUTOMATION.md`에 따라 GitHub PR, branch, checks와 production smoke를 대조해 판정한다.

| ID      | 상태    | 작업                                 | AUTO_MERGE | 완료 조건                                                              |
| ------- | ------- | ------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| APK-000 | DONE    | 프로젝트 및 자동화 기반 부트스트랩   | false      | main 초기 커밋과 로컬 check/build 성공                                 |
| APK-001 | DONE    | 자동화 파이프라인 검증용 상태 페이지 | true       | CI, Preview, squash merge, production smoke 전체 성공                  |
| APK-002 | DONE    | 초보자용 AI API 비용 계산기          | true       | APK-001 production smoke 성공 후 eligible                              |
| APK-003 | DONE    | 모델 가격·특성 비교                  | true       | APK-002 production smoke 성공 후 eligible                              |
| APK-004 | DONE    | 목적 기반 모델 선택 도우미           | true       | APK-003 production smoke 성공 후 eligible                              |
| APK-005 | DONE    | 공식 출처 기반 모델 카탈로그 단일화  | true       | 가격·특성·출처·검증일을 단일 데이터 계층에서 사용하고 검증 테스트 통과 |
| APK-006 | DONE    | 도구별 독립 URL과 탐색 구조          | true       | 계산기·비교·선택 도우미 전용 경로, 내비게이션, canonical, sitemap 완성 |
| APK-007 | OPEN    | 공유 가능한 계산 결과와 URL 상태     | true       | 입력값을 URL로 재현하고 복사·공유·초기화 및 잘못된 파라미터 처리 완료  |
| APK-008 | BLOCKED | 프롬프트 토큰·비용 추정기            | true       | 붙여넣은 텍스트의 토큰 범위와 선택 모델별 요청·월간 예상 비용 제공     |
| APK-009 | BLOCKED | Batch·캐싱 절감 시뮬레이터           | true       | 기본 비용과 최적화 시나리오를 비교하고 절감액·가정·제약을 명시         |
| APK-010 | BLOCKED | 실제 서비스 사용량 프리셋            | true       | 챗봇·문서요약·코딩·이미지 분석 프리셋과 수정 가능한 계산 입력 제공     |
| APK-011 | BLOCKED | 모델 상세 및 공급자 가격 가이드      | true       | 색인 가능한 상세 페이지, 공식 출처, 업데이트 날짜, 관련 도구 연결 완성 |
| APK-012 | BLOCKED | 가격 데이터 신선도 자동 점검         | true       | 정기 점검이 변경 후보를 보고하고 근거 없이 가격을 자동 덮어쓰지 않음   |
| APK-013 | BLOCKED | SEO 신뢰·콘텐츠 품질 기반            | true       | About·방법론·출처·면책·Privacy·Terms와 구조화 데이터·내부 링크 완성    |
| APK-014 | BLOCKED | 익명 사용 분석과 핵심 퍼널 계측      | true       | 개인정보 최소화 상태로 도구 사용·완료·공유 이벤트 및 운영 문서 검증    |

## 작업 선택 규칙

위에서 아래 순서로 첫 번째 `OPEN` 작업 하나만 선택한다. 선행 작업의 production smoke가 확인되지 않으면 `BLOCKED`를 열지 않는다.

각 작업이 완료되고 해당 main 커밋의 production smoke가 성공하면, 완료 작업을 `DONE`으로 바꾸고 바로 다음 작업 하나만 `OPEN`으로 전환한다. 나머지는 `BLOCKED`로 유지한다.

가격·모델·정책처럼 변할 수 있는 정보는 공식 공급자 자료를 우선한다. 확인 날짜와 출처를 사용자에게 표시하고, 근거가 충돌하거나 확인되지 않으면 추측해 게시하지 않는다.
