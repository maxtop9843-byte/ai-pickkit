"use client";

import { useState } from "react";
import {
  compareProviderBudgets,
  type ProviderBudgetInput,
} from "@/lib/provider-budget-comparison";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const initialInput: ProviderBudgetInput = {
  monthlyRequests: 10000,
  inputTokensPerRequest: 2000,
  outputTokensPerRequest: 500,
  monthlyBudgetUsd: 100,
};

export default function ProviderBudgetComparison() {
  const [input, setInput] = useState(initialInput);
  const results = compareProviderBudgets(input);
  const cheapest = results[0];

  function update<K extends keyof ProviderBudgetInput>(key: K, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.shell} data-smoke="provider-budget-comparison">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>PROVIDER BUDGET BENCH</p>
          <h2>같은 워크로드를 공급자별 월간 비용으로 비교하세요</h2>
          <span>
            요청 수와 토큰 사용량을 한 번 입력하고 OpenAI·Anthropic·Google의
            대표 균형형 모델 비용을 같은 조건에서 비교합니다.
          </span>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>월간 요청 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.monthlyRequests}
              onChange={(event) =>
                update("monthlyRequests", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>월 예산 (USD)</span>
            <input
              min="0"
              step="1"
              inputMode="decimal"
              type="number"
              value={input.monthlyBudgetUsd}
              onChange={(event) =>
                update("monthlyBudgetUsd", Number(event.target.value))
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
              value={input.inputTokensPerRequest}
              onChange={(event) =>
                update("inputTokensPerRequest", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>요청당 출력 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.outputTokensPerRequest}
              onChange={(event) =>
                update("outputTokensPerRequest", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>비교 기준</strong>
          <span>표준 처리 · 캐시·Batch·장문 할증 제외</span>
          <p>
            모델 능력은 동일하지 않습니다. 이 표는 같은 토큰 워크로드의 가격
            차이를 빠르게 확인하는 예산 기준선입니다.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>LOWEST ESTIMATE</p>
        <div className={styles.primary}>
          <span>{cheapest.provider} · {cheapest.model}</span>
          <strong>{usd.format(cheapest.monthlyCostUsd)}</strong>
        </div>
        <dl>
          {results.map((item) => (
            <div key={item.id}>
              <dt>
                {item.provider} · {item.model}
              </dt>
              <dd>{usd.format(item.monthlyCostUsd)}</dd>
            </div>
          ))}
        </dl>
        {results.map((item) => (
          <p className={styles.caveat} key={`${item.id}-budget`}>
            {item.provider}: 요청당 {usd.format(item.costPerRequestUsd)} · {item.withinBudget ? "예산 이내" : `예산 초과 ${usd.format(Math.abs(item.budgetRemainingUsd))}`}
          </p>
        ))}
        <p className={styles.caveat}>
          공급자별 기능, 품질, 컨텍스트, 도구 비용, 세금과 할인은 포함하지
          않습니다. 실제 청구 전 공식 가격을 다시 확인하세요.
        </p>
        {results.map((item) => (
          <a href={item.sourceUrl} key={`${item.id}-source`} target="_blank" rel="noreferrer">
            {item.provider} 공식 가격 · {item.verifiedAt}
          </a>
        ))}
      </aside>
    </section>
  );
}
