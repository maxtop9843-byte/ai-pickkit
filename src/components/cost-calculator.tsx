"use client";

import { useMemo, useState } from "react";
import {
  calculateCost,
  modelPrices,
  VERIFIED_AT,
  workloadPresets,
} from "@/lib/cost-calculator";

const usd = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function money(value: number) {
  if (value > 0 && value < 0.01) return `$${value.toFixed(4)}`;
  return usd.format(value);
}

function NumericField({
  id,
  label,
  value,
  onChange,
  suffix,
  hint,
  min = 0,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  hint?: string;
  min?: number;
}) {
  return (
    <label className="numeric-field" htmlFor={id}>
      <span>{label}</span>
      <span className="number-control">
        <input
          id={id}
          type="number"
          min={min}
          step="1"
          value={value}
          onChange={(event) =>
            onChange(Math.max(min, Number(event.target.value) || 0))
          }
        />
        <span>{suffix}</span>
      </span>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function CostCalculator() {
  const [presetId, setPresetId] = useState("support");
  const [usersPerDay, setUsersPerDay] = useState(100);
  const [requestsPerUser, setRequestsPerUser] = useState(5);
  const [inputTokens, setInputTokens] = useState(450);
  const [outputTokens, setOutputTokens] = useState(220);
  const [advanced, setAdvanced] = useState(false);

  const results = useMemo(
    () =>
      modelPrices.map((model) => ({
        model,
        cost: calculateCost(
          { usersPerDay, requestsPerUser, inputTokens, outputTokens },
          model,
        ),
      })),
    [usersPerDay, requestsPerUser, inputTokens, outputTokens],
  );

  const selectPreset = (id: string) => {
    const preset = workloadPresets.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setInputTokens(preset.inputTokens);
    setOutputTokens(preset.outputTokens);
  };

  const recommended = results[1];

  return (
    <section
      className="calculator-shell"
      id="calculator"
      aria-labelledby="calculator-title"
    >
      <div className="calculator-intro">
        <p className="section-kicker">API COST ESTIMATOR · APK-002</p>
        <h2 id="calculator-title">토큰을 몰라도 계산할 수 있어요</h2>
        <p>
          서비스 모습과 이용량만 알려주세요. 같은 조건에서 세 가지 모델 비용을
          비교합니다.
        </p>
      </div>

      <div className="calculator-grid">
        <form
          className="input-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend>
              <span>01</span> 무엇을 만들고 있나요?
            </legend>
            <div className="preset-grid">
              {workloadPresets.map((preset) => (
                <button
                  className={
                    presetId === preset.id ? "preset active" : "preset"
                  }
                  type="button"
                  key={preset.id}
                  onClick={() => selectPreset(preset.id)}
                  aria-pressed={presetId === preset.id}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span>02</span> 하루에 얼마나 사용하나요?
            </legend>
            <div className="field-grid">
              <NumericField
                id="users"
                label="하루 사용자"
                value={usersPerDay}
                onChange={setUsersPerDay}
                suffix="명"
              />
              <NumericField
                id="requests"
                label="1명당 질문"
                value={requestsPerUser}
                onChange={setRequestsPerUser}
                suffix="회"
              />
            </div>
            <p className="volume-note">
              하루 총{" "}
              <strong>
                {(usersPerDay * requestsPerUser).toLocaleString("ko-KR")}회
              </strong>{" "}
              · 한 달은 30일로 계산
            </p>
          </fieldset>

          <button
            className="advanced-toggle"
            type="button"
            onClick={() => setAdvanced(!advanced)}
            aria-expanded={advanced}
          >
            <span>
              <b>03</b> 질문·답변 길이 직접 조정
            </span>
            <span aria-hidden="true">{advanced ? "−" : "+"}</span>
          </button>
          {advanced ? (
            <div className="advanced-fields">
              <NumericField
                id="input-tokens"
                label="질문·맥락 길이"
                value={inputTokens}
                onChange={setInputTokens}
                suffix="토큰"
                hint="한글은 내용에 따라 토큰 수가 크게 달라질 수 있어요."
              />
              <NumericField
                id="output-tokens"
                label="답변 길이"
                value={outputTokens}
                onChange={setOutputTokens}
                suffix="토큰"
              />
            </div>
          ) : null}
        </form>

        <aside className="result-panel" aria-live="polite">
          <div className="result-heading">
            <span>월 예상 비용</span>
            <span className="live-dot">입력 즉시 반영</span>
          </div>
          <div className="headline-result">
            <p>균형형 모델 기준</p>
            <strong>{money(recommended.cost.monthly)}</strong>
            <span>
              월 {recommended.cost.requestsPerDay.toLocaleString("ko-KR")}회 ×
              30일
            </span>
          </div>
          <dl className="mini-metrics">
            <div>
              <dt>요청 1회</dt>
              <dd>{money(recommended.cost.requestCost)}</dd>
            </div>
            <div>
              <dt>하루</dt>
              <dd>{money(recommended.cost.daily)}</dd>
            </div>
            <div>
              <dt>사용자 1명 / 월</dt>
              <dd>{money(recommended.cost.perUserMonthly)}</dd>
            </div>
          </dl>
          <div className="saving-box">
            <div>
              <span>Batch 처리 시</span>
              <strong>{money(recommended.cost.batchMonthly)}</strong>
              <small>최대 50% 절감</small>
            </div>
            <div>
              <span>입력 70% 캐시 적중 시</span>
              <strong>{money(recommended.cost.cachedMonthly)}</strong>
              <small>반복 입력에 유리</small>
            </div>
          </div>
          <p className="result-caveat">
            실제 청구액에는 도구 호출, 검색, 이미지, 환율, 세금이 추가될 수
            있습니다.
          </p>
        </aside>
      </div>

      <div className="comparison" aria-labelledby="comparison-title">
        <div className="comparison-head">
          <div>
            <p className="section-kicker">ONE WORKLOAD, THREE CHOICES</p>
            <h3 id="comparison-title">품질 단계별 비용 비교</h3>
          </div>
          <span>USD · 1M 토큰당 공식 API 가격</span>
        </div>
        <div className="model-list">
          {results.map(({ model, cost }) => (
            <article
              className={
                model.calculatorTier === "balanced"
                  ? "model-row recommended"
                  : "model-row"
              }
              key={model.id}
            >
              <div className={`tier-marker ${model.calculatorTier}`}>
                <span>{model.calculatorTierLabel}</span>
              </div>
              <div className="model-name">
                <strong>{model.name}</strong>
                <span>{model.bestFor}</span>
              </div>
              <div className="token-price">
                <span>입력 / 출력</span>
                <strong>
                  ${model.inputPerMillion} / ${model.outputPerMillion}
                </strong>
              </div>
              <div className="model-total">
                <span>월 예상</span>
                <strong>{money(cost.monthly)}</strong>
              </div>
            </article>
          ))}
        </div>
        <div className="source-note">
          <span>가격 확인일 {VERIFIED_AT}</span>
          <a href={modelPrices[0].source} target="_blank" rel="noreferrer">
            Anthropic 공식 가격표 ↗
          </a>
          <span>
            Sonnet 5는 2026-08-31까지의 출시 프로모션 가격을 적용했습니다.
          </span>
        </div>
      </div>
    </section>
  );
}
