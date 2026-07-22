"use client";

import { useState } from "react";
import { CATALOG_VERIFIED_AT } from "@/lib/model-catalog";
import {
  priorityOptions,
  purposeOptions,
  recommendModels,
  type ModelPriority,
  type ModelPurpose,
  type ProviderPreference,
} from "@/lib/model-selector";

const providerOptions: Array<{ id: ProviderPreference; label: string }> = [
  { id: "any", label: "상관없음" },
  { id: "OpenAI", label: "OpenAI" },
  { id: "Anthropic", label: "Anthropic" },
  { id: "Google", label: "Google" },
];

const usd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string; description?: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="selector-fieldset">
      <legend>{label}</legend>
      <div className="selector-choices">
        {options.map((option) => (
          <button
            className={
              value === option.id ? "selector-choice active" : "selector-choice"
            }
            type="button"
            aria-pressed={value === option.id}
            key={option.id}
            onClick={() => onChange(option.id)}
          >
            <strong>{option.label}</strong>
            {option.description ? <span>{option.description}</span> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ModelSelector() {
  const [purpose, setPurpose] = useState<ModelPurpose>("coding");
  const [priority, setPriority] = useState<ModelPriority>("balance");
  const [provider, setProvider] = useState<ProviderPreference>("any");
  const [allowPreview, setAllowPreview] = useState(false);

  const recommendations = recommendModels({
    purpose,
    priority,
    provider,
    allowPreview,
  });
  const [first, ...alternatives] = recommendations;

  return (
    <section
      className="selector-shell"
      id="selector"
      data-smoke="model-selector"
      aria-labelledby="selector-title"
    >
      <div className="selector-heading">
        <div>
          <p className="section-kicker">MODEL PATHFINDER · APK-004</p>
          <h2 id="selector-title">네 가지만 고르면 후보를 좁혀드려요</h2>
        </div>
        <p>
          벤치마크 우승자를 정하는 도구가 아닙니다. 용도와 예산 조건을 기존 공식
          가격표에 적용해 먼저 시험할 모델을 찾습니다.
        </p>
      </div>

      <div className="selector-workbench">
        <form
          className="selector-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <ChoiceGroup
            label="01 · 어떤 일을 맡길까요?"
            value={purpose}
            options={purposeOptions}
            onChange={setPurpose}
          />
          <ChoiceGroup
            label="02 · 무엇이 가장 중요한가요?"
            value={priority}
            options={priorityOptions}
            onChange={setPriority}
          />
          <ChoiceGroup<ProviderPreference>
            label="03 · 선호하는 공급자가 있나요?"
            value={provider}
            options={providerOptions}
            onChange={setProvider}
          />
          <label className="preview-toggle">
            <span>
              <strong>04 · Preview 모델도 포함</strong>
              <small>정식 출시 전 모델은 사양과 가격이 바뀔 수 있어요.</small>
            </span>
            <input
              type="checkbox"
              checked={allowPreview}
              onChange={(event) => setAllowPreview(event.target.checked)}
            />
          </label>
        </form>

        <aside className="selector-result" aria-live="polite">
          <div className="selector-result-label">
            <span>먼저 시험할 모델</span>
            <small>선택 즉시 다시 계산</small>
          </div>
          <div className="selector-winner">
            <span
              className={`provider-dot ${first.model.provider.toLowerCase()}`}
              aria-hidden="true"
            />
            <p>
              {first.model.provider} · {first.model.tierLabel}
            </p>
            <h3>{first.model.name}</h3>
            <strong>{first.model.bestFor}</strong>
          </div>
          <dl className="selector-price">
            <div>
              <dt>입력</dt>
              <dd>${usd.format(first.model.inputPerMillion)}</dd>
            </div>
            <div>
              <dt>출력</dt>
              <dd>${usd.format(first.model.outputPerMillion)}</dd>
            </div>
            <span>/ 1M tokens</span>
          </dl>
          <ul className="selector-reasons">
            {first.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="selector-tradeoff">
            <strong>확인할 점</strong>
            {first.tradeoff}
          </p>
        </aside>
      </div>

      <div className="selector-alternatives">
        <div>
          <span>대안 후보</span>
          <small>실제 프롬프트 20~50개로 품질과 비용을 함께 비교하세요.</small>
        </div>
        {alternatives.map(({ model }, index) => (
          <article key={model.id}>
            <span>0{index + 2}</span>
            <div>
              <strong>{model.name}</strong>
              <small>{model.bestFor}</small>
            </div>
            <p>
              ${usd.format(model.inputPerMillion)} / $
              {usd.format(model.outputPerMillion)}
            </p>
          </article>
        ))}
      </div>

      <p className="selector-method">
        추천 방식: 용도 적합도 + 선택한 가격 등급 + 공급자 선호를 합산한 설명
        가능한 규칙 · 가격 확인일 {CATALOG_VERIFIED_AT} · 최종 선택 전 공급자
        공식 문서와 실제 평가 세트 확인 권장
      </p>
    </section>
  );
}
