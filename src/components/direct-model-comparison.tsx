"use client";

import { useState } from "react";
import {
  compareModels,
  comparisonModels,
  type DirectComparisonInput,
} from "@/lib/direct-model-comparison";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("ko-KR");

const initialInput: DirectComparisonInput = {
  modelAId: "gpt-5-6-terra",
  modelBId: "claude-sonnet-5",
  monthlyRequests: 100_000,
  inputTokensPerRequest: 2_000,
  outputTokensPerRequest: 500,
};

export default function DirectModelComparison() {
  const [input, setInput] = useState(initialInput);
  const result = compareModels(input);

  function update<K extends keyof DirectComparisonInput>(
    key: K,
    value: DirectComparisonInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.shell} data-smoke="direct-model-comparison">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>MODEL A / B BENCH</p>
          <h2>같은 워크로드에서 두 모델을 바로 비교하세요</h2>
          <span>
            가격뿐 아니라 컨텍스트, 등급, 멀티모달·Batch 지원과 추천 용도를 한
            화면에서 확인합니다.
          </span>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>모델 A</span>
            <select
              value={input.modelAId}
              onChange={(event) => update("modelAId", event.target.value)}
            >
              {comparisonModels.map((model) => (
                <option value={model.id} key={`a-${model.id}`}>
                  {model.provider} · {model.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>모델 B</span>
            <select
              value={input.modelBId}
              onChange={(event) => update("modelBId", event.target.value)}
            >
              {comparisonModels.map((model) => (
                <option value={model.id} key={`b-${model.id}`}>
                  {model.provider} · {model.name}
                </option>
              ))}
            </select>
          </label>
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
        </div>

        <div className={styles.row}>
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
          <span>동일 요청 수와 입력·출력 토큰의 표준 API 가격</span>
          <p>
            품질과 지연 시간은 워크로드에 따라 달라집니다. 가격 우승자가 곧 성능
            우승자는 아니므로 실제 프롬프트로 별도 평가하세요.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>DIRECT COMPARISON</p>
        <div className={styles.primary}>
          <span>월간 절감 가능액</span>
          <strong>{usd.format(result.monthlySavingsUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>{result.modelA.name} 월간 비용</dt>
            <dd>{usd.format(result.monthlyCostAUsd)}</dd>
          </div>
          <div>
            <dt>{result.modelB.name} 월간 비용</dt>
            <dd>{usd.format(result.monthlyCostBUsd)}</dd>
          </div>
          <div>
            <dt>더 저렴한 모델</dt>
            <dd>{result.cheaperModel?.name ?? "동일"}</dd>
          </div>
          <div>
            <dt>컨텍스트 A / B</dt>
            <dd>
              {integer.format(result.modelA.contextWindowTokens)} /{" "}
              {integer.format(result.modelB.contextWindowTokens)}
            </dd>
          </div>
          <div>
            <dt>등급 A / B</dt>
            <dd>
              {result.modelA.tierLabel} / {result.modelB.tierLabel}
            </dd>
          </div>
          <div>
            <dt>멀티모달 A / B</dt>
            <dd>
              {result.modelA.multimodal ? "지원" : "미지원"} /{" "}
              {result.modelB.multimodal ? "지원" : "미지원"}
            </dd>
          </div>
          <div>
            <dt>Batch A / B</dt>
            <dd>
              {result.modelA.batch ? "지원" : "미지원"} /{" "}
              {result.modelB.batch ? "지원" : "미지원"}
            </dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          A는 {result.modelA.bestFor}, B는 {result.modelB.bestFor}에 적합합니다.
          동일 모델을 선택하면 기준값 확인용으로 사용할 수 있습니다.
        </p>
        <a href={result.modelA.source} target="_blank" rel="noreferrer">
          {result.modelA.provider} 공식 출처 · {result.modelA.verifiedAt}
        </a>
        <br />
        <a href={result.modelB.source} target="_blank" rel="noreferrer">
          {result.modelB.provider} 공식 출처 · {result.modelB.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
