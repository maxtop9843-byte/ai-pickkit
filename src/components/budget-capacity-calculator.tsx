"use client";

import { useState } from "react";
import { calculateBudgetCapacity } from "@/lib/budget-capacity";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const integer = new Intl.NumberFormat("ko-KR");

export default function BudgetCapacityCalculator() {
  const [monthlyBudgetUsd, setMonthlyBudgetUsd] = useState(500);
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState(2_000);
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState(500);
  const [requestsPerUser, setRequestsPerUser] = useState(100);

  const result = calculateBudgetCapacity({
    monthlyBudgetUsd,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerUser,
  });

  return (
    <>
      <section className={styles.shell} data-smoke="budget-capacity-calculator">
        <div className={styles.controls}>
          <div className={styles.heading}>
            <p>BUDGET CAPACITY PLANNER</p>
            <h2>월 예산으로 가능한 요청량과 사용자 수를 역산하세요</h2>
            <span>
              동일한 워크로드를 각 모델의 공식 표준 API 가격에 적용해 예산
              안에서 처리 가능한 규모를 비교합니다.
            </span>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>월 예산 (USD)</span>
              <input
                min="0"
                inputMode="decimal"
                type="number"
                value={monthlyBudgetUsd}
                onChange={(event) =>
                  setMonthlyBudgetUsd(Number(event.target.value))
                }
              />
            </label>
            <label className={styles.field}>
              <span>사용자당 월 요청 수</span>
              <input
                min="1"
                inputMode="numeric"
                type="number"
                value={requestsPerUser}
                onChange={(event) =>
                  setRequestsPerUser(Number(event.target.value))
                }
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>요청당 입력 토큰</span>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                value={inputTokensPerRequest}
                onChange={(event) =>
                  setInputTokensPerRequest(Number(event.target.value))
                }
              />
            </label>
            <label className={styles.field}>
              <span>요청당 출력 토큰</span>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                value={outputTokensPerRequest}
                onChange={(event) =>
                  setOutputTokensPerRequest(Number(event.target.value))
                }
              />
            </label>
          </div>

          <div className={styles.selection}>
            <strong>계산 기준</strong>
            <span>표준 API 입력·출력 가격, 캐시·Batch 할인 미적용</span>
            <p>
              실제 비용은 프롬프트 길이, 재시도, 캐시 적중률과 도구 호출에 따라
              달라질 수 있습니다. 아래 값은 예산 계획용 상한 추정치입니다.
            </p>
          </div>
        </div>

        <aside className={styles.result} aria-live="polite">
          <p className={styles.kicker}>CAPACITY RECOMMENDATION</p>
          <div className={styles.primary}>
            <span>최대 처리량 추천</span>
            <strong>{result.recommended?.model.name ?? "계산 불가"}</strong>
          </div>
          {result.recommended ? (
            <dl>
              <div>
                <dt>가능한 월 요청</dt>
                <dd>
                  {integer.format(result.recommended.maxMonthlyRequests)}회
                </dd>
              </div>
              <div>
                <dt>가능한 월 사용자</dt>
                <dd>{integer.format(result.recommended.maxMonthlyUsers)}명</dd>
              </div>
              <div>
                <dt>요청당 예상 비용</dt>
                <dd>{usd.format(result.recommended.costPerRequestUsd)}</dd>
              </div>
              <div>
                <dt>모델 등급</dt>
                <dd>{result.recommended.model.tierLabel}</dd>
              </div>
            </dl>
          ) : null}
          <p className={styles.caveat}>
            추천은 품질 순위가 아니라 입력한 예산에서 가장 많은 사용자를
            처리하는 모델입니다. 품질과 지연 시간은 실제 프롬프트로 별도
            검증하세요.
          </p>
          {result.recommended ? (
            <a
              href={result.recommended.model.source}
              target="_blank"
              rel="noreferrer"
            >
              {result.recommended.model.provider} 공식 출처 ·{" "}
              {result.recommended.model.verifiedAt}
            </a>
          ) : null}
        </aside>
      </section>

      <section
        className={styles.scenarios}
        aria-labelledby="capacity-table-title"
      >
        <div className={styles.scenarioHeader}>
          <div>
            <p className={styles.kicker}>MODEL CAPACITY TABLE</p>
            <h2 id="capacity-table-title">모델별 예산 처리량</h2>
            <span>가능한 사용자 수가 많은 순서로 정렬했습니다.</span>
          </div>
        </div>
        <ul className={styles.scenarioList}>
          {result.rows.map((row) => (
            <li key={row.model.id}>
              <strong>
                {row.model.provider} · {row.model.name}
              </strong>
              <span>
                요청 {integer.format(row.maxMonthlyRequests)}회 · 사용자{" "}
                {integer.format(row.maxMonthlyUsers)}명
              </span>
              <div>
                <a href={row.model.source} target="_blank" rel="noreferrer">
                  출처
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
