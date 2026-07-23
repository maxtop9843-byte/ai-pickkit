"use client";

import { useState } from "react";
import {
  calculateRagCost,
  embeddingPriceOptions,
  type RagCostInput,
} from "@/lib/rag-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 6,
});

const integer = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

const initialInput: RagCostInput = {
  documentCount: 1000,
  averageTokensPerDocument: 1000,
  chunkTokens: 500,
  overlapPercent: 20,
  queriesPerDay: 100,
  averageQueryTokens: 24,
  daysPerMonth: 30,
  reindexEveryDays: 30,
};

export default function RagCostCalculator() {
  const [optionId, setOptionId] = useState(embeddingPriceOptions[0].id);
  const [input, setInput] = useState(initialInput);
  const option =
    embeddingPriceOptions.find((item) => item.id === optionId) ??
    embeddingPriceOptions[0];
  const result = calculateRagCost(option, input);

  function update<K extends keyof RagCostInput>(key: K, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.shell} data-smoke="rag-cost-calculator">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>RAG COST WORKBENCH</p>
          <h2>문서와 검색 사용량을 입력하세요</h2>
          <span>
            초기 색인, 반복 재색인, 사용자 질의 임베딩 비용을 분리해 계산합니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>임베딩 모델</span>
          <select
            value={option.id}
            onChange={(event) => setOptionId(event.target.value)}
          >
            {embeddingPriceOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.provider} · {item.model}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>문서 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.documentCount}
              onChange={(event) =>
                update("documentCount", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>문서당 평균 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.averageTokensPerDocument}
              onChange={(event) =>
                update("averageTokensPerDocument", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>청크 크기(토큰)</span>
            <input
              min="1"
              inputMode="numeric"
              type="number"
              value={input.chunkTokens}
              onChange={(event) =>
                update("chunkTokens", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>청크 중첩률(%)</span>
            <input
              min="0"
              max="90"
              inputMode="numeric"
              type="number"
              value={input.overlapPercent}
              onChange={(event) =>
                update("overlapPercent", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>하루 질의 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.queriesPerDay}
              onChange={(event) =>
                update("queriesPerDay", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>질의당 평균 토큰</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={input.averageQueryTokens}
              onChange={(event) =>
                update("averageQueryTokens", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>월 운영일</span>
            <input
              min="1"
              max="31"
              inputMode="numeric"
              type="number"
              value={input.daysPerMonth}
              onChange={(event) =>
                update("daysPerMonth", Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>재색인 주기(일)</span>
            <input
              min="1"
              inputMode="numeric"
              type="number"
              value={input.reindexEveryDays}
              onChange={(event) =>
                update("reindexEveryDays", Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>{option.model}</strong>
          <span>
            100만 토큰당 {usd.format(option.pricePerMillionTokensUsd)}
          </span>
          <p>{option.note}</p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>ESTIMATED COST</p>
        <div className={styles.primary}>
          <span>월 임베딩 예상 비용</span>
          <strong>{usd.format(result.monthlyUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>예상 청크 수</dt>
            <dd>{integer.format(result.chunkCount)}개</dd>
          </div>
          <div>
            <dt>월 재색인 횟수</dt>
            <dd>{result.indexingRuns}회</dd>
          </div>
          <div>
            <dt>색인 비용</dt>
            <dd>{usd.format(result.indexingUsd)}</dd>
          </div>
          <div>
            <dt>질의 임베딩 비용</dt>
            <dd>{usd.format(result.queryUsd)}</dd>
          </div>
          <div>
            <dt>총 임베딩 토큰</dt>
            <dd>{integer.format(result.totalEmbeddingTokens)}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          벡터 데이터베이스 저장·검색, 생성 모델의 답변 비용, 네트워크와 세금은
          제외합니다. 중첩률은 색인 토큰 증가분으로 근사합니다.
        </p>
        <a href={option.sourceUrl} target="_blank" rel="noreferrer">
          공식 가격 확인 · {option.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
