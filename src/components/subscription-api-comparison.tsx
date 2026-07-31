"use client";

import { useMemo, useState } from "react";
import styles from "./image-cost-calculator.module.css";

type Plan = {
  id: "chatgpt-plus" | "claude-pro";
  provider: string;
  name: string;
  monthlyUsd: number;
  apiModel: string;
  apiInputPerMillion: number;
  apiOutputPerMillion: number;
  pricingNote: string;
  sourceUrl: string;
  apiSourceUrl: string;
  verifiedAt: string;
};

const plans: Plan[] = [
  {
    id: "chatgpt-plus",
    provider: "OpenAI",
    name: "ChatGPT Plus",
    monthlyUsd: 20,
    apiModel: "GPT-5.6 Terra",
    apiInputPerMillion: 2.5,
    apiOutputPerMillion: 15,
    pricingNote: "표준 처리 기준",
    sourceUrl:
      "https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus",
    apiSourceUrl: "https://developers.openai.com/api/docs/pricing",
    verifiedAt: "2026-07-31",
  },
  {
    id: "claude-pro",
    provider: "Anthropic",
    name: "Claude Pro",
    monthlyUsd: 20,
    apiModel: "Claude Sonnet 5",
    apiInputPerMillion: 2,
    apiOutputPerMillion: 10,
    pricingNote: "2026-08-31까지 적용되는 표준 가격",
    sourceUrl:
      "https://support.anthropic.com/en/articles/8325610-how-much-does-claude-pro-cost",
    apiSourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    verifiedAt: "2026-07-31",
  },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function SubscriptionApiComparison() {
  const [planId, setPlanId] = useState<Plan["id"]>("chatgpt-plus");
  const [monthlyRequests, setMonthlyRequests] = useState(1200);
  const [inputTokens, setInputTokens] = useState(1800);
  const [outputTokens, setOutputTokens] = useState(600);

  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const result = useMemo(() => {
    const safeRequests = Math.max(0, monthlyRequests || 0);
    const safeInput = Math.max(0, inputTokens || 0);
    const safeOutput = Math.max(0, outputTokens || 0);
    const costPerRequest =
      (safeInput / 1_000_000) * plan.apiInputPerMillion +
      (safeOutput / 1_000_000) * plan.apiOutputPerMillion;
    const apiMonthly = safeRequests * costPerRequest;
    const breakEvenRequests =
      costPerRequest > 0 ? plan.monthlyUsd / costPerRequest : null;

    return {
      apiMonthly,
      difference: Math.abs(plan.monthlyUsd - apiMonthly),
      apiIsCheaper: apiMonthly < plan.monthlyUsd,
      breakEvenRequests,
    };
  }, [inputTokens, monthlyRequests, outputTokens, plan]);

  return (
    <section className={styles.shell} data-smoke="subscription-api-comparison">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>SUBSCRIPTION OR API</p>
          <h2>
            고정 구독료와 사용량 기반 API 비용을 같은 달 기준으로 비교하세요
          </h2>
          <span>
            구독은 웹앱 기능과 사용 한도를 포함하고, API는 실제 토큰 사용량만
            과금됩니다. 이 계산은 금액 기준선이며 두 상품의 기능이 같다는 뜻은
            아닙니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>비교할 구독 플랜</span>
          <select
            value={planId}
            onChange={(event) => setPlanId(event.target.value as Plan["id"])}
          >
            {plans.map((item) => (
              <option value={item.id} key={item.id}>
                {`${item.provider} · ${item.name} (${usd.format(item.monthlyUsd)}/월)`}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>월간 요청 수</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={monthlyRequests}
              onChange={(event) =>
                setMonthlyRequests(Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>요청당 입력 토큰</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={inputTokens}
              onChange={(event) => setInputTokens(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>요청당 출력 토큰</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={outputTokens}
              onChange={(event) => setOutputTokens(Number(event.target.value))}
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>비교 전 확인</strong>
          <span>
            {`${plan.apiModel} · ${plan.pricingNote} · 캐시·Batch·도구 호출·세금 제외`}
          </span>
          <p>
            구독의 메시지 한도, 기능, 모델 접근권과 API의 자동화·제품 통합
            가치는 별도로 판단해야 합니다.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>MONTHLY DECISION</p>
        <div className={styles.primary}>
          <span>
            {result.apiIsCheaper
              ? "API 예상 비용이 더 낮습니다"
              : `${plan.name} 구독료가 더 낮습니다`}
          </span>
          <strong>
            {usd.format(
              result.apiIsCheaper ? result.apiMonthly : plan.monthlyUsd,
            )}
          </strong>
        </div>
        <dl>
          <div>
            <dt>{plan.name} 월 구독료</dt>
            <dd>{usd.format(plan.monthlyUsd)}</dd>
          </div>
          <div>
            <dt>{plan.apiModel} API 예상 비용</dt>
            <dd>{usd.format(result.apiMonthly)}</dd>
          </div>
          <div>
            <dt>월 차이</dt>
            <dd>{usd.format(result.difference)}</dd>
          </div>
          <div>
            <dt>금액상 손익분기 요청 수</dt>
            <dd>
              {result.breakEvenRequests === null
                ? "토큰을 입력하세요"
                : `${Math.round(result.breakEvenRequests).toLocaleString(
                    "ko-KR",
                  )}회`}
            </dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          구독 사용 한도는 고정 토큰 보장이 아니며 정책과 모델에 따라 달라질 수
          있습니다. 결과를 보장값으로 사용하지 마세요.
        </p>
        <a href={plan.sourceUrl} target="_blank" rel="noreferrer">
          {plan.name} 공식 가격 · {plan.verifiedAt}
        </a>
        <a href={plan.apiSourceUrl} target="_blank" rel="noreferrer">
          {plan.apiModel} 공식 API 가격 · {plan.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
