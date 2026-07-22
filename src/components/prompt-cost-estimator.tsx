"use client";

import { useMemo, useState } from "react";
import {
  CATALOG_VERIFIED_AT,
  catalogModels,
  providerSources,
} from "@/lib/model-catalog";
import {
  estimatePromptCost,
  estimatePromptTokens,
} from "@/lib/prompt-cost-estimator";

const examplePrompt = `당신은 고객 문의를 분류하는 도우미입니다.
문의 내용을 읽고 카테고리, 긴급도, 답변 초안을 JSON으로 작성하세요.

문의: 결제는 됐는데 주문 내역이 보이지 않아요.`;

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

function range(lower: number, upper: number) {
  return lower === upper ? money(lower) : `${money(lower)}–${money(upper)}`;
}

function clampInteger(value: string, maximum: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(maximum, Math.max(0, Math.trunc(parsed)));
}

export default function PromptCostEstimator() {
  const [prompt, setPrompt] = useState("");
  const [outputTokens, setOutputTokens] = useState(500);
  const [requestsPerDay, setRequestsPerDay] = useState(100);
  const [selectedIds, setSelectedIds] = useState([
    "gpt-5-6-luna",
    "claude-sonnet-5",
    "gemini-3-1-pro-preview",
  ]);

  const estimate = useMemo(() => estimatePromptTokens(prompt), [prompt]);
  const selectedModels = catalogModels.filter((model) =>
    selectedIds.includes(model.id),
  );

  const toggleModel = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return;
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      return;
    }
    if (selectedIds.length >= 3) return;
    setSelectedIds([...selectedIds, id]);
  };

  return (
    <section
      className="prompt-estimator-shell"
      data-smoke="prompt-cost-estimator"
      aria-labelledby="prompt-estimator-title"
    >
      <div className="prompt-estimator-heading">
        <div>
          <p className="section-kicker">PROMPT METER · APK-008</p>
          <h2 id="prompt-estimator-title">붙여넣고, 범위로 예산을 잡으세요</h2>
        </div>
        <p>
          텍스트는 서버로 전송하거나 저장하지 않습니다. 실제 토큰 수는 모델과
          토크나이저 버전에 따라 달라질 수 있어 범위로 추정합니다.
        </p>
      </div>

      <div className="prompt-workbench">
        <div className="prompt-input-panel">
          <div className="prompt-label-row">
            <label htmlFor="prompt-text">프롬프트 원문</label>
            <div>
              <button type="button" onClick={() => setPrompt(examplePrompt)}>
                예시 넣기
              </button>
              <button type="button" onClick={() => setPrompt("")}>
                비우기
              </button>
            </div>
          </div>
          <textarea
            id="prompt-text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="시스템 지시문, 사용자 메시지, 코드나 문서를 여기에 붙여넣으세요."
            spellCheck={false}
            maxLength={1_000_000}
          />
          <dl className="prompt-diagnostics">
            <div>
              <dt>문자</dt>
              <dd>{estimate.characters.toLocaleString("ko-KR")}</dd>
            </div>
            <div>
              <dt>단어 덩어리</dt>
              <dd>{estimate.words.toLocaleString("ko-KR")}</dd>
            </div>
            <div>
              <dt>줄</dt>
              <dd>{estimate.lines.toLocaleString("ko-KR")}</dd>
            </div>
            <div>
              <dt>한·중·일 문자</dt>
              <dd>{estimate.cjkCharacters.toLocaleString("ko-KR")}</dd>
            </div>
          </dl>
        </div>

        <aside className="prompt-token-panel" aria-live="polite">
          <span>예상 입력 토큰</span>
          <strong>
            {estimate.lower.toLocaleString("ko-KR")}–
            {estimate.upper.toLocaleString("ko-KR")}
          </strong>
          <p>언어와 기호 구성에 따른 보수적 범위</p>
          <div className="prompt-volume-fields">
            <label htmlFor="prompt-output-tokens">
              <span>응답 예상 길이</span>
              <span>
                <input
                  id="prompt-output-tokens"
                  type="number"
                  min="0"
                  max="10000000"
                  step="1"
                  value={outputTokens}
                  onChange={(event) =>
                    setOutputTokens(
                      clampInteger(event.target.value, 10_000_000),
                    )
                  }
                />
                토큰
              </span>
            </label>
            <label htmlFor="prompt-requests">
              <span>하루 요청 수</span>
              <span>
                <input
                  id="prompt-requests"
                  type="number"
                  min="0"
                  max="10000000"
                  step="1"
                  value={requestsPerDay}
                  onChange={(event) =>
                    setRequestsPerDay(
                      clampInteger(event.target.value, 10_000_000),
                    )
                  }
                />
                회
              </span>
            </label>
          </div>
          <small>월간 비용은 30일 기준입니다.</small>
        </aside>
      </div>

      <div className="prompt-model-picker">
        <div>
          <h3>비교할 모델 선택</h3>
          <p>{selectedIds.length}/3 · 최소 1개, 최대 3개</p>
        </div>
        <div className="prompt-model-options">
          {catalogModels.map((model) => (
            <button
              type="button"
              key={model.id}
              className={selectedIds.includes(model.id) ? "selected" : ""}
              onClick={() => toggleModel(model.id)}
              aria-pressed={selectedIds.includes(model.id)}
              disabled={
                !selectedIds.includes(model.id) && selectedIds.length >= 3
              }
            >
              <span>{model.provider}</span>
              <strong>{model.name}</strong>
              <small>{model.tierLabel}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="prompt-cost-ledger">
        <div className="prompt-cost-row prompt-cost-head" aria-hidden="true">
          <span>선택 모델</span>
          <span>입력 토큰</span>
          <span>요청 1회</span>
          <span>월간 예상</span>
        </div>
        {selectedModels.map((model) => {
          const cost = estimatePromptCost({
            estimate,
            outputTokens,
            requestsPerDay,
            model,
          });
          return (
            <article className="prompt-cost-row" key={model.id}>
              <div>
                <span>{model.provider}</span>
                <strong>{model.name}</strong>
                <small>{model.bestFor}</small>
              </div>
              <p>
                {estimate.lower.toLocaleString("ko-KR")}–
                {estimate.upper.toLocaleString("ko-KR")}
              </p>
              <p>{range(cost.requestLower, cost.requestUpper)}</p>
              <p>
                <strong>{range(cost.monthlyLower, cost.monthlyUpper)}</strong>
                <small>{cost.monthlyRequests.toLocaleString("ko-KR")}회</small>
              </p>
            </article>
          );
        })}
      </div>

      <div className="prompt-method-note">
        <p>
          <strong>추정 방식</strong> 공백을 제외한 한·중·일 문자는 문자당
          0.65–1.6토큰, 그 밖의 문자·숫자·기호는 2.5–5자당 1토큰 범위로
          계산합니다. 시스템 메시지, 도구 정의, 이미지와 공급자별 부가 토큰은
          포함하지 않습니다.
        </p>
        <p>
          가격 확인 {CATALOG_VERIFIED_AT} ·{" "}
          {Object.values(providerSources).map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label} ↗
            </a>
          ))}
        </p>
      </div>
    </section>
  );
}
