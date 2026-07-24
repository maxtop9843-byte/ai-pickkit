"use client";

import { useState } from "react";
import {
  calculateCompositeServiceCost,
  compositePricing,
  type CompositeServiceCostInput,
} from "@/lib/composite-service-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const initialInput: CompositeServiceCostInput = {
  monthlyRequests: 10000,
  inputTokensPerRequest: 2000,
  outputTokensPerRequest: 500,
  imagesPerRequest: 0.1,
  audioMinutesPerRequest: 0.5,
  searchesPerRequest: 1,
  targetMarginPercent: 70,
};

export default function CompositeServiceCostCalculator() {
  const [input, setInput] = useState(initialInput);
  const result = calculateCompositeServiceCost(input);

  function update<K extends keyof CompositeServiceCostInput>(
    key: K,
    value: number,
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.shell} data-smoke="composite-service-cost">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>COMPOSITE SERVICE LEDGER</p>
          <h2>복합 AI 서비스의 요청당 실제 원가를 계산하세요</h2>
          <span>
            텍스트·이미지·음성·웹 검색이 한 요청에 함께 들어가는 서비스의
            단위 원가와 월간 비용을 한 번에 합산합니다.
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
            <span>목표 매출총이익률 (%)</span>
            <input
              min="0"
              max="95"
              step="1"
              inputMode="decimal"
              type="number"
              value={input.targetMarginPercent}
              onChange={(event) =>
                update("targetMarginPercent", Number(event.target.value))
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

        <div className={styles.row}>
          <label className={styles.field}>
            <span>요청당 생성 이미지 수</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.imagesPerRequest}
              onChange={(event) =>
                update("imagesPerRequest", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>요청당 음성 처리 분</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.audioMinutesPerRequest}
              onChange={(event) =>
                update("audioMinutesPerRequest", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>요청당 웹 검색 호출</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.searchesPerRequest}
              onChange={(event) =>
                update("searchesPerRequest", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>기본 가격 기준</strong>
          <span>GPT-5.6 Terra · 표준 이미지 · 실시간 음성 인식 · 웹 검색</span>
          <p>
            저장소, 네트워크, 결제 수수료, 세금, 재시도와 인프라 비용은 포함하지
            않습니다.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>UNIT ECONOMICS</p>
        <div className={styles.primary}>
          <span>요청당 원가</span>
          <strong>{usd.format(result.unitCostUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>텍스트</dt>
            <dd>{usd.format(result.textCostPerRequestUsd)}</dd>
          </div>
          <div>
            <dt>이미지</dt>
            <dd>{usd.format(result.imageCostPerRequestUsd)}</dd>
          </div>
          <div>
            <dt>음성</dt>
            <dd>{usd.format(result.audioCostPerRequestUsd)}</dd>
          </div>
          <div>
            <dt>웹 검색</dt>
            <dd>{usd.format(result.searchCostPerRequestUsd)}</dd>
          </div>
          <div>
            <dt>월간 총원가</dt>
            <dd>{usd.format(result.monthlyCostUsd)}</dd>
          </div>
          <div>
            <dt>목표 마진 기준 최소 판매가</dt>
            <dd>{usd.format(result.suggestedPricePerRequestUsd)}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          목표 매출총이익률 기준 월 매출은 {usd.format(
            result.monthlyRevenueAtTargetMarginUsd,
          )}
          입니다. 실제 판매가는 운영비와 결제 수수료를 별도로 반영하세요.
        </p>
        <a
          href={compositePricing.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          OpenAI 공식 가격 · {compositePricing.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
