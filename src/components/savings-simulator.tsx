"use client";

import { useMemo, useState } from "react";
import {
  CATALOG_VERIFIED_AT,
  catalogModels,
  getCatalogModel,
} from "@/lib/model-catalog";
import { calculateSavingsScenarios } from "@/lib/savings-simulator";

const usd = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

function money(value: number) {
  if (value > 0 && value < 0.0001) return `$${value.toFixed(6)}`;
  return usd.format(value);
}

function clampInteger(value: string, maximum = 10_000_000) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(maximum, Math.max(0, Math.trunc(parsed)));
}

export default function SavingsSimulator() {
  const [modelId, setModelId] = useState("claude-sonnet-5");
  const [inputTokens, setInputTokens] = useState(5000);
  const [outputTokens, setOutputTokens] = useState(1000);
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [repeatedInputPercent, setRepeatedInputPercent] = useState(70);
  const [cacheHitPercent, setCacheHitPercent] = useState(70);
  const [batchPercent, setBatchPercent] = useState(60);
  const model = getCatalogModel(modelId);

  const scenarios = useMemo(
    () =>
      calculateSavingsScenarios(
        {
          inputTokens,
          outputTokens,
          requestsPerDay,
          repeatedInputPercent,
          cacheHitPercent,
          batchPercent,
        },
        model,
      ),
    [
      batchPercent,
      cacheHitPercent,
      inputTokens,
      model,
      outputTokens,
      repeatedInputPercent,
      requestsPerDay,
    ],
  );
  const baseline = scenarios[0];
  const best = scenarios[3];

  return (
    <section
      className="savings-shell"
      data-smoke="savings-simulator"
      aria-labelledby="savings-title"
    >
      <div className="savings-heading">
        <div>
          <p className="section-kicker">EFFICIENCY LEDGER · APK-009</p>
          <h2 id="savings-title">할인율보다, 적용 가능한 요청부터 보세요</h2>
        </div>
        <p>
          반복되는 입력과 비실시간 요청이 얼마나 되는지 나눠 입력하면 기본
          비용과 최적화 시나리오의 차이를 계산합니다.
        </p>
      </div>

      <div className="savings-workbench">
        <form onSubmit={(event) => event.preventDefault()}>
          <label className="savings-model-select" htmlFor="savings-model">
            <span>비교 모델</span>
            <select
              id="savings-model"
              value={modelId}
              onChange={(event) => setModelId(event.target.value)}
            >
              {catalogModels.map((catalogModel) => (
                <option value={catalogModel.id} key={catalogModel.id}>
                  {catalogModel.provider} · {catalogModel.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>01 · 기본 사용량</legend>
            <div className="savings-number-grid">
              <label htmlFor="savings-input-tokens">
                <span>요청당 입력</span>
                <span>
                  <input
                    id="savings-input-tokens"
                    type="number"
                    min="0"
                    max="10000000"
                    value={inputTokens}
                    onChange={(event) =>
                      setInputTokens(clampInteger(event.target.value))
                    }
                  />
                  토큰
                </span>
              </label>
              <label htmlFor="savings-output-tokens">
                <span>요청당 출력</span>
                <span>
                  <input
                    id="savings-output-tokens"
                    type="number"
                    min="0"
                    max="10000000"
                    value={outputTokens}
                    onChange={(event) =>
                      setOutputTokens(clampInteger(event.target.value))
                    }
                  />
                  토큰
                </span>
              </label>
              <label htmlFor="savings-requests">
                <span>하루 요청</span>
                <span>
                  <input
                    id="savings-requests"
                    type="number"
                    min="0"
                    max="10000000"
                    value={requestsPerDay}
                    onChange={(event) =>
                      setRequestsPerDay(clampInteger(event.target.value))
                    }
                  />
                  회
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="savings-ranges">
            <legend>02 · 최적화 가능한 비중</legend>
            <label htmlFor="repeated-input">
              <span>
                <strong>반복 입력</strong>
                <small>고정 시스템 지시문·공통 문서 비중</small>
              </span>
              <input
                id="repeated-input"
                type="range"
                min="0"
                max="100"
                value={repeatedInputPercent}
                onChange={(event) =>
                  setRepeatedInputPercent(Number(event.target.value))
                }
              />
              <b>{repeatedInputPercent}%</b>
            </label>
            <label htmlFor="cache-hit">
              <span>
                <strong>캐시 적중</strong>
                <small>반복 입력 중 실제 캐시 단가 적용 비중</small>
              </span>
              <input
                id="cache-hit"
                type="range"
                min="0"
                max="100"
                value={cacheHitPercent}
                onChange={(event) =>
                  setCacheHitPercent(Number(event.target.value))
                }
              />
              <b>{cacheHitPercent}%</b>
            </label>
            <label htmlFor="batch-share">
              <span>
                <strong>Batch 처리</strong>
                <small>즉시 응답이 필요 없는 요청 비중</small>
              </span>
              <input
                id="batch-share"
                type="range"
                min="0"
                max="100"
                value={batchPercent}
                onChange={(event) =>
                  setBatchPercent(Number(event.target.value))
                }
              />
              <b>{batchPercent}%</b>
            </label>
          </fieldset>
        </form>

        <aside className="savings-summary" aria-live="polite">
          <span>단순 결합 시 월 절감 예상</span>
          <strong>{money(best.monthlySavings)}</strong>
          <p>{best.savingsPercent.toFixed(1)}% · 기본 비용 대비</p>
          <dl>
            <div>
              <dt>기본 월 비용</dt>
              <dd>{money(baseline.monthlyCost)}</dd>
            </div>
            <div>
              <dt>최적화 후</dt>
              <dd>{money(best.monthlyCost)}</dd>
            </div>
            <div>
              <dt>월 요청</dt>
              <dd>{(requestsPerDay * 30).toLocaleString("ko-KR")}회</dd>
            </div>
          </dl>
          <small>
            캐시 쓰기·저장 비용, 최소 토큰 조건, 실패·재시도 비용은 포함하지
            않습니다.
          </small>
        </aside>
      </div>

      <div className="savings-ledger">
        <div className="savings-row savings-row-head" aria-hidden="true">
          <span>시나리오</span>
          <span>월 예상 비용</span>
          <span>월 절감액</span>
          <span>절감률</span>
          <span>기본 대비</span>
        </div>
        {scenarios.map((scenario) => (
          <article
            className={`savings-row ${scenario.id === "combined" ? "best" : ""}`}
            key={scenario.id}
          >
            <div>
              <span>{scenario.id === "baseline" ? "기준" : "가정"}</span>
              <strong>{scenario.label}</strong>
              <small>요청 1회 {money(scenario.requestCost)}</small>
            </div>
            <p>{money(scenario.monthlyCost)}</p>
            <p>{money(scenario.monthlySavings)}</p>
            <p>{scenario.savingsPercent.toFixed(1)}%</p>
            <span className="savings-bar" aria-hidden="true">
              <i
                style={{
                  width: `${baseline.monthlyCost > 0 ? (scenario.monthlyCost / baseline.monthlyCost) * 100 : 0}%`,
                }}
              />
            </span>
          </article>
        ))}
      </div>

      <div className="savings-constraints">
        <article>
          <span>01</span>
          <h3>캐시는 같은 입력 구간에만</h3>
          <p>
            사용자가 매번 바꾸는 내용이 아니라 반복되는 prefix가 실제 적중할
            때만 캐시 단가를 적용합니다.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Batch는 비실시간 요청에만</h3>
          <p>
            즉시 답해야 하는 채팅에는 맞지 않습니다. 처리 시간·요청 한도·지원
            조건은 공급자 문서를 확인하세요.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>결합 결과는 예산 가정</h3>
          <p>
            화면은 캐시 계산 후 선택한 Batch 비중에 50% 단가를 적용한 단순
            시나리오입니다. 실제 청구 규칙이 우선합니다.
          </p>
        </article>
      </div>

      <p className="savings-source">
        가격 확인 {CATALOG_VERIFIED_AT} · {model.name} · 입력 $
        {model.inputPerMillion}/ 캐시 입력 $
        {model.cachedInputPerMillion ?? model.inputPerMillion} / 출력 $
        {model.outputPerMillion} per 1M tokens ·{" "}
        <a href={model.source} target="_blank" rel="noreferrer">
          {model.provider} 공식 가격표 ↗
        </a>
      </p>
    </section>
  );
}
