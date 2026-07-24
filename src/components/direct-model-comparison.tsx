"use client";

import { useEffect, useState } from "react";
import {
  compareModels,
  comparisonModels,
  type DirectComparisonInput,
} from "@/lib/direct-model-comparison";
import {
  duplicateScenario,
  parseSavedCostScenarios,
  SAVED_COST_SCENARIOS_KEY,
  serializeSavedCostScenarios,
  type SavedCostScenario,
} from "@/lib/saved-cost-scenarios";
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

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export default function DirectModelComparison() {
  const [input, setInput] = useState(initialInput);
  const [scenarioName, setScenarioName] = useState("기본 비교 시나리오");
  const [savedScenarios, setSavedScenarios] = useState<SavedCostScenario[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const result = compareModels(input);

  useEffect(() => {
    const loadSavedScenarios = () => {
      setSavedScenarios(
        parseSavedCostScenarios(localStorage.getItem(SAVED_COST_SCENARIOS_KEY)),
      );
      setStorageReady(true);
    };

    const timeoutId = window.setTimeout(loadSavedScenarios, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function persist(scenarios: SavedCostScenario[], message: string) {
    setSavedScenarios(scenarios);
    localStorage.setItem(
      SAVED_COST_SCENARIOS_KEY,
      serializeSavedCostScenarios(scenarios),
    );
    setStorageMessage(message);
  }

  function update<K extends keyof DirectComparisonInput>(
    key: K,
    value: DirectComparisonInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function saveCurrentScenario() {
    const name = scenarioName.trim();
    if (!name) {
      setStorageMessage("시나리오 이름을 입력하세요.");
      return;
    }

    const now = new Date().toISOString();
    const scenario: SavedCostScenario = {
      id: makeId(),
      name,
      createdAt: now,
      updatedAt: now,
      input: { ...input },
    };
    persist(
      [scenario, ...savedScenarios].slice(0, 20),
      `“${name}”을 저장했습니다.`,
    );
  }

  function renameScenario(id: string, name: string) {
    const normalized = name.trim();
    if (!normalized) return;
    const now = new Date().toISOString();
    persist(
      savedScenarios.map((scenario) =>
        scenario.id === id
          ? { ...scenario, name: normalized, updatedAt: now }
          : scenario,
      ),
      "시나리오 이름을 변경했습니다.",
    );
  }

  function loadScenario(scenario: SavedCostScenario) {
    setInput({ ...scenario.input });
    setScenarioName(scenario.name);
    setStorageMessage(`“${scenario.name}”을 불러왔습니다.`);
  }

  function cloneScenario(scenario: SavedCostScenario) {
    const copy = duplicateScenario(
      scenario,
      makeId(),
      new Date().toISOString(),
    );
    persist(
      [copy, ...savedScenarios].slice(0, 20),
      `“${copy.name}”을 만들었습니다.`,
    );
  }

  function removeScenario(scenario: SavedCostScenario) {
    persist(
      savedScenarios.filter((item) => item.id !== scenario.id),
      `“${scenario.name}”을 삭제했습니다.`,
    );
  }

  return (
    <>
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
              품질과 지연 시간은 워크로드에 따라 달라집니다. 가격 우승자가 곧
              성능 우승자는 아니므로 실제 프롬프트로 별도 평가하세요.
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
            A는 {result.modelA.bestFor}, B는 {result.modelB.bestFor}에
            적합합니다. 동일 모델을 선택하면 기준값 확인용으로 사용할 수
            있습니다.
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

      <section
        className={styles.scenarios}
        aria-labelledby="saved-scenarios-title"
      >
        <div className={styles.scenarioHeader}>
          <div>
            <p className={styles.kicker}>LOCAL SCENARIOS</p>
            <h2 id="saved-scenarios-title">비용 시나리오 저장</h2>
            <span>
              이 브라우저에만 최대 20개를 저장합니다. 서버로 전송하지 않습니다.
            </span>
          </div>
          <div className={styles.saveControls}>
            <label className={styles.field}>
              <span>시나리오 이름</span>
              <input
                value={scenarioName}
                maxLength={60}
                onChange={(event) => setScenarioName(event.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={saveCurrentScenario}
              disabled={!storageReady}
            >
              현재 값 저장
            </button>
          </div>
        </div>

        <p className={styles.storageMessage} aria-live="polite">
          {storageMessage}
        </p>

        {storageReady && savedScenarios.length === 0 ? (
          <p className={styles.emptyScenario}>저장된 시나리오가 없습니다.</p>
        ) : (
          <ul className={styles.scenarioList}>
            {savedScenarios.map((scenario) => (
              <li key={scenario.id}>
                <label>
                  <span className="sr-only">시나리오 이름</span>
                  <input
                    defaultValue={scenario.name}
                    maxLength={60}
                    onBlur={(event) =>
                      renameScenario(scenario.id, event.target.value)
                    }
                  />
                </label>
                <span>
                  {comparisonModels.find(
                    (model) => model.id === scenario.input.modelAId,
                  )?.name ?? scenario.input.modelAId}
                  {" / "}
                  {comparisonModels.find(
                    (model) => model.id === scenario.input.modelBId,
                  )?.name ?? scenario.input.modelBId}
                </span>
                <div>
                  <button type="button" onClick={() => loadScenario(scenario)}>
                    불러오기
                  </button>
                  <button type="button" onClick={() => cloneScenario(scenario)}>
                    복제
                  </button>
                  <button
                    type="button"
                    onClick={() => removeScenario(scenario)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
