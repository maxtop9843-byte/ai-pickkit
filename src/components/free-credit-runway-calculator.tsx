"use client";

import { useState } from "react";
import {
  calculateFreeCreditRunway,
  type FreeCreditRunwayInput,
} from "@/lib/free-credit-runway";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const initialInput: FreeCreditRunwayInput = {
  balanceUsd: 300,
  dailyUsageUsd: 8,
  dailyGrowthPercent: 2,
  warningThresholdDays: 30,
};

export default function FreeCreditRunwayCalculator() {
  const [input, setInput] = useState(initialInput);
  const result = calculateFreeCreditRunway(input);

  function update<K extends keyof FreeCreditRunwayInput>(key: K, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  const exhaustedAt =
    result.daysRemaining === null
      ? null
      : new Date(Date.now() + result.daysRemaining * 86_400_000);

  return (
    <section className={styles.shell} data-smoke="free-credit-runway-calculator">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>FREE CREDIT RUNWAY</p>
          <h2>무료 크레딧이 언제 소진될지 미리 확인하세요</h2>
          <span>
            현재 일일 사용액과 성장률을 반영해 남은 기간과 경고 구간을 계산합니다.
          </span>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>남은 크레딧 (USD)</span>
            <input
              min="0"
              step="1"
              inputMode="decimal"
              type="number"
              value={input.balanceUsd}
              onChange={(event) => update("balanceUsd", Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>현재 일일 사용액 (USD)</span>
            <input
              min="0"
              step="0.01"
              inputMode="decimal"
              type="number"
              value={input.dailyUsageUsd}
              onChange={(event) => update("dailyUsageUsd", Number(event.target.value))}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>일일 사용량 성장률 (%)</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.dailyGrowthPercent}
              onChange={(event) =>
                update("dailyGrowthPercent", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>경고 기준 (일)</span>
            <input
              min="1"
              inputMode="numeric"
              type="number"
              value={input.warningThresholdDays}
              onChange={(event) =>
                update("warningThresholdDays", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>계산 기준</strong>
          <span>일일 사용액이 입력한 성장률만큼 매일 증가한다고 가정</span>
          <p>프로모션 만료일, 세금, 환율, 공급자별 사용 제한은 포함하지 않습니다.</p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>CREDIT RUNWAY</p>
        <div className={styles.primary}>
          <span>{result.status === "safe" ? "안정" : result.status === "warning" ? "주의" : "위험"}</span>
          <strong>
            {result.daysRemaining === null ? "소진 없음" : `${result.daysRemaining}일`}
          </strong>
        </div>
        <dl>
          <div>
            <dt>예상 소진일</dt>
            <dd>
              {exhaustedAt
                ? exhaustedAt.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
                : "현재 사용액이 0입니다"}
            </dd>
          </div>
          <div>
            <dt>소진 직전 일일 사용액</dt>
            <dd>{usd.format(result.endingDailyUsageUsd)}</dd>
          </div>
          <div>
            <dt>현재 일일 사용액</dt>
            <dd>{usd.format(Math.max(0, input.dailyUsageUsd))}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          사용량이 급증하거나 공급자 정책이 바뀌면 실제 소진일은 달라질 수 있습니다.
        </p>
      </aside>
    </section>
  );
}
