"use client";

import { useState } from "react";
import {
  calculateFineTuningCost,
  fineTuningPriceOptions,
  type FineTuningCostInput,
} from "@/lib/fine-tuning-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const integer = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

const initialInput: FineTuningCostInput = {
  trainingExamples: 5000,
  averageTokensPerExample: 600,
  epochs: 3,
  monthlyRequests: 100000,
  averageInputTokens: 500,
  averageOutputTokens: 150,
};

export default function FineTuningCostCalculator() {
  const [optionId, setOptionId] = useState(fineTuningPriceOptions[0].id);
  const [input, setInput] = useState(initialInput);
  const option =
    fineTuningPriceOptions.find((item) => item.id === optionId) ??
    fineTuningPriceOptions[0];
  const result = calculateFineTuningCost(option, input);

  function update<K extends keyof FineTuningCostInput>(key: K, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section
      className={styles.shell}
      data-smoke="fine-tuning-cost-calculator"
    >
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>FINE-TUNING COST WORKBENCH</p>
          <h2>학습 데이터와 운영 사용량을 입력하세요</h2>
          <span>
            데이터셋·에폭에 따른 일회성 학습비와 월간 추론비를 분리해
            계산합니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>튜닝 모델</span>
          <select
            value={option.id}
            onChange={(event) => setOptionId(event.target.value)}
          >
            {fineTuningPriceOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.provider} · {item.model}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>학습 예제 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.trainingExamples}
              onChange={(event) =>
                update("trainingExamples", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>예제당 평균 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.averageTokensPerExample}
              onChange={(event) =>
                update("averageTokensPerExample", Number(event.target.value))
              }
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>학습 에폭</span>
          <input
            min="1"
            inputMode="numeric"
            type="number"
            value={input.epochs}
            onChange={(event) => update("epochs", Number(event.target.value))}
          />
        </label>

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
            <span>요청당 입력 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.averageInputTokens}
              onChange={(event) =>
                update("averageInputTokens", Number(event.target.value))
              }
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>요청당 출력 토큰</span>
          <input
            min="0"
            inputMode="numeric"
            type="number"
            value={input.averageOutputTokens}
            onChange={(event) =>
              update("averageOutputTokens", Number(event.target.value))
            }
          />
        </label>

        <div className={styles.selection}>
          <strong>{option.model}</strong>
          <span>
            학습 100만 토큰당 {usd.format(option.trainingPerMillionTokensUsd)}
          </span>
          <p>{option.note}</p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>ESTIMATED COST</p>
        <div className={styles.primary}>
          <span>첫 달 예상 비용</span>
          <strong>{usd.format(result.firstMonthUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>데이터셋 토큰</dt>
            <dd>{integer.format(result.datasetTokens)}</dd>
          </div>
          <div>
            <dt>과금 학습 토큰</dt>
            <dd>{integer.format(result.billableTrainingTokens)}</dd>
          </div>
          <div>
            <dt>일회성 학습 비용</dt>
            <dd>{usd.format(result.trainingUsd)}</dd>
          </div>
          <div>
            <dt>월간 입력 비용</dt>
            <dd>{usd.format(result.monthlyInputUsd)}</dd>
          </div>
          <div>
            <dt>월간 출력 비용</dt>
            <dd>{usd.format(result.monthlyOutputUsd)}</dd>
          </div>
          <div>
            <dt>월간 추론 비용</dt>
            <dd>{usd.format(result.monthlyInferenceUsd)}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          학습 토큰은 데이터셋 토큰 × 에폭으로 계산합니다. 데이터 정제,
          평가, 저장, 재학습, 네트워크, 세금과 할인은 제외합니다. 실제 과금은
          공급자 청구서를 확인하세요.
        </p>
        <a href={option.sourceUrl} target="_blank" rel="noreferrer">
          공식 가격 확인 · {option.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
