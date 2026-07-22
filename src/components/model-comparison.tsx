"use client";

import { useMemo, useState } from "react";
import {
  blendedPrice,
  catalogModels,
  CATALOG_VERIFIED_AT,
  providerSources,
  type ModelTier,
  type Provider,
} from "@/lib/model-catalog";

const providers: Array<Provider | "전체"> = [
  "전체",
  "OpenAI",
  "Anthropic",
  "Google",
];
const tiers: Array<{ value: ModelTier | "all"; label: string }> = [
  { value: "all", label: "모든 등급" },
  { value: "economy", label: "경제형" },
  { value: "balanced", label: "균형형" },
  { value: "frontier", label: "최상위" },
];

const usd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function ModelComparison() {
  const [provider, setProvider] = useState<Provider | "전체">("전체");
  const [tier, setTier] = useState<ModelTier | "all">("all");
  const [sort, setSort] = useState<"recommended" | "input" | "output">(
    "recommended",
  );
  const [selected, setSelected] = useState<string[]>([
    "gemini-3-5-flash-lite",
    "claude-sonnet-5",
  ]);

  const visible = useMemo(() => {
    const filtered = catalogModels.filter(
      (model) =>
        (provider === "전체" || model.provider === provider) &&
        (tier === "all" || model.tier === tier),
    );
    if (sort === "input")
      return filtered.toSorted((a, b) => a.inputPerMillion - b.inputPerMillion);
    if (sort === "output")
      return filtered.toSorted(
        (a, b) => a.outputPerMillion - b.outputPerMillion,
      );
    return filtered.toSorted((a, b) => blendedPrice(a) - blendedPrice(b));
  }, [provider, sort, tier]);

  const chosen = catalogModels.filter((model) => selected.includes(model.id));

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length === 3) return current;
      return [...current, id];
    });
  }

  return (
    <section
      className="compare-shell"
      id="models"
      data-smoke="model-comparison"
      aria-labelledby="models-title"
    >
      <div className="compare-heading">
        <div>
          <p className="section-kicker">MODEL INDEX · 09</p>
          <h2 id="models-title">가격만 말고, 쓸 이유까지 비교하세요</h2>
        </div>
        <p>
          같은 회사 안에서도 모델의 역할은 다릅니다. 목적에 맞는 등급을 먼저
          고르고, 필요한 모델만 비교함에 담아보세요.
        </p>
      </div>

      <div className="model-toolbar" aria-label="모델 필터">
        <div className="provider-tabs">
          {providers.map((item) => (
            <button
              key={item}
              className={provider === item ? "active" : ""}
              onClick={() => setProvider(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="model-selects">
          <label>
            <span>등급</span>
            <select
              value={tier}
              onChange={(event) =>
                setTier(event.target.value as ModelTier | "all")
              }
            >
              {tiers.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>정렬</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
            >
              <option value="recommended">총 단가 낮은 순</option>
              <option value="input">입력 단가 낮은 순</option>
              <option value="output">출력 단가 낮은 순</option>
            </select>
          </label>
        </div>
      </div>

      <div className="model-list" aria-live="polite">
        <div className="catalog-row catalog-row-head" aria-hidden="true">
          <span>모델 / 추천 용도</span>
          <span>입력</span>
          <span>출력</span>
          <span>지원</span>
          <span>비교</span>
        </div>
        {visible.map((model) => {
          const isSelected = selected.includes(model.id);
          const disabled = !isSelected && selected.length === 3;
          return (
            <article
              className={`catalog-row ${isSelected ? "selected" : ""}`}
              key={model.id}
            >
              <div className="model-identity">
                <span
                  className={`provider-dot ${model.provider.toLowerCase()}`}
                  aria-hidden="true"
                />
                <div>
                  <div className="model-name-line">
                    <h3>{model.name}</h3>
                    {model.status && <small>{model.status}</small>}
                  </div>
                  <p>
                    {model.provider} · {model.tierLabel} · {model.bestFor}
                  </p>
                </div>
              </div>
              <p className="model-price">
                <strong>${usd.format(model.inputPerMillion)}</strong>
                <span>/ 1M tokens</span>
              </p>
              <p className="model-price">
                <strong>${usd.format(model.outputPerMillion)}</strong>
                <span>/ 1M tokens</span>
              </p>
              <div className="capability-tags">
                <span>멀티모달</span>
                {model.batch && <span>Batch</span>}
                {model.cachedInputPerMillion !== undefined && <span>캐시</span>}
              </div>
              <button
                className="compare-pick"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => toggle(model.id)}
                type="button"
              >
                {isSelected ? "선택됨" : "담기"}
              </button>
            </article>
          );
        })}
      </div>

      <div className="compare-tray">
        <div className="tray-copy">
          <span>{chosen.length}/3</span>
          <div>
            <strong>나란히 비교</strong>
            <small>최대 3개 모델을 선택하세요</small>
          </div>
        </div>
        <div className="tray-models">
          {chosen.map((model) => (
            <div className="tray-model" key={model.id}>
              <button
                type="button"
                onClick={() => toggle(model.id)}
                aria-label={`${model.name} 비교에서 제거`}
              >
                ×
              </button>
              <span>{model.provider}</span>
              <strong>{model.name}</strong>
              <p>
                <b>${usd.format(model.inputPerMillion)}</b> 입력 ·{" "}
                <b>${usd.format(model.outputPerMillion)}</b> 출력
              </p>
              <small>{model.bestFor}</small>
            </div>
          ))}
          {Array.from({ length: 3 - chosen.length }).map((_, index) => (
            <div className="tray-empty" key={index}>
              모델을 담아주세요
            </div>
          ))}
        </div>
      </div>

      <div className="catalog-note">
        <p>
          <strong>가격 기준</strong> 표준 API의 텍스트 토큰 단가(USD). Google
          Pro는 20만 토큰 이하 기준이며 Claude Sonnet 5는 2026-08-31까지의
          프로모션 가격입니다.
        </p>
        <p>
          마지막 확인 {CATALOG_VERIFIED_AT} ·{" "}
          {providers.slice(1).map((name) => {
            const source = providerSources[name as Provider];
            return (
              <a href={source.url} target="_blank" rel="noreferrer" key={name}>
                {source.label} ↗
              </a>
            );
          })}
        </p>
      </div>
    </section>
  );
}
