"use client";

import { useState } from "react";
import {
  agentModelPrices,
  calculateAgentToolCost,
  type AgentToolCostInput,
} from "@/lib/agent-tool-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const integer = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

const initialInput: AgentToolCostInput = {
  monthlyTasks: 1000,
  modelCallsPerTask: 3,
  inputTokensPerCall: 2000,
  outputTokensPerCall: 500,
  webSearchCallsPerTask: 2,
  codeSessionsPerTask: 0.1,
  otherToolCallsPerTask: 1,
  otherToolCostPerCallUsd: 0.005,
};

export default function AgentToolCostCalculator() {
  const [modelId, setModelId] = useState(agentModelPrices[1].id);
  const [input, setInput] = useState(initialInput);
  const model =
    agentModelPrices.find((item) => item.id === modelId) ?? agentModelPrices[1];
  const result = calculateAgentToolCost(model, input);

  function update<K extends keyof AgentToolCostInput>(key: K, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.shell} data-smoke="agent-tool-cost-calculator">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>AGENT COST WORKBENCH</p>
          <h2>에이전트 한 작업의 전체 비용을 조립하세요</h2>
          <span>
            모델 호출, 웹 검색, 코드 실행과 외부 도구 호출을 합산해 작업당·월간
            비용을 계산합니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>기본 모델</span>
          <select value={model.id} onChange={(event) => setModelId(event.target.value)}>
            {agentModelPrices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.provider} · {item.model}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>월간 작업 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.monthlyTasks}
              onChange={(event) => update("monthlyTasks", Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>작업당 모델 호출 수</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.modelCallsPerTask}
              onChange={(event) =>
                update("modelCallsPerTask", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>호출당 입력 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.inputTokensPerCall}
              onChange={(event) =>
                update("inputTokensPerCall", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>호출당 출력 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.outputTokensPerCall}
              onChange={(event) =>
                update("outputTokensPerCall", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>작업당 웹 검색 호출</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.webSearchCallsPerTask}
              onChange={(event) =>
                update("webSearchCallsPerTask", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>작업당 코드 실행 세션</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.codeSessionsPerTask}
              onChange={(event) =>
                update("codeSessionsPerTask", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>작업당 기타 도구 호출</span>
            <input
              min="0"
              step="0.1"
              inputMode="decimal"
              type="number"
              value={input.otherToolCallsPerTask}
              onChange={(event) =>
                update("otherToolCallsPerTask", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>기타 도구 1회 비용 (USD)</span>
            <input
              min="0"
              step="0.001"
              inputMode="decimal"
              type="number"
              value={input.otherToolCostPerCallUsd}
              onChange={(event) =>
                update("otherToolCostPerCallUsd", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>{model.model}</strong>
          <span>
            입력 {usd.format(model.inputPerMillionTokensUsd)} · 출력{" "}
            {usd.format(model.outputPerMillionTokensUsd)} / 100만 토큰
          </span>
          <p>도구 호출량은 평균값으로 입력하고 실제 공급자 청구서와 비교하세요.</p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>ESTIMATED COST</p>
        <div className={styles.primary}>
          <span>월간 에이전트 비용</span>
          <strong>{usd.format(result.monthlyTotalUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>작업당 비용</dt>
            <dd>{usd.format(result.costPerTaskUsd)}</dd>
          </div>
          <div>
            <dt>월간 모델 호출</dt>
            <dd>{integer.format(result.totalModelCalls)}</dd>
          </div>
          <div>
            <dt>모델 입력 비용</dt>
            <dd>{usd.format(result.modelInputUsd)}</dd>
          </div>
          <div>
            <dt>모델 출력 비용</dt>
            <dd>{usd.format(result.modelOutputUsd)}</dd>
          </div>
          <div>
            <dt>웹 검색 비용</dt>
            <dd>{usd.format(result.webSearchUsd)}</dd>
          </div>
          <div>
            <dt>코드 실행 비용</dt>
            <dd>{usd.format(result.codeExecutionUsd)}</dd>
          </div>
          <div>
            <dt>기타 도구 비용</dt>
            <dd>{usd.format(result.otherToolsUsd)}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          재시도, 캐시, 장기 컨텍스트 할증, 저장소·네트워크·세금과 공급자별 할인은
          제외합니다. 웹 검색과 코드 실행 기본 단가는 변경될 수 있습니다.
        </p>
        <a href={model.sourceUrl} target="_blank" rel="noreferrer">
          공식 가격 확인 · {model.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
