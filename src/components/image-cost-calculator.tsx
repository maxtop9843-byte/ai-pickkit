"use client";

import { useMemo, useState } from "react";
import {
  calculateImageCost,
  imagePriceOptions,
} from "@/lib/image-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

export default function ImageCostCalculator() {
  const [optionId, setOptionId] = useState(imagePriceOptions[0].id);
  const [imagesPerDay, setImagesPerDay] = useState(100);
  const [daysPerMonth, setDaysPerMonth] = useState(30);

  const option =
    imagePriceOptions.find((item) => item.id === optionId) ??
    imagePriceOptions[0];
  const result = useMemo(
    () =>
      calculateImageCost(
        option.pricePerImageUsd,
        Math.max(0, imagesPerDay),
        Math.min(31, Math.max(1, daysPerMonth)),
      ),
    [daysPerMonth, imagesPerDay, option.pricePerImageUsd],
  );

  return (
    <section className={styles.shell} data-smoke="image-cost-calculator">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>WORKLOAD</p>
          <h2>이미지 생성량을 입력하세요</h2>
          <span>
            이미지 출력 비용만 계산하며 입력 토큰·편집 입력 비용은
            제외합니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>모델·품질·해상도</span>
          <select
            value={optionId}
            onChange={(event) => setOptionId(event.target.value)}
          >
            {imagePriceOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.provider} · {item.model} · {item.label} (
                {item.resolution})
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>하루 생성 이미지 수</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={imagesPerDay}
              onChange={(event) =>
                setImagesPerDay(Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>월 운영일</span>
            <input
              min="1"
              max="31"
              inputMode="numeric"
              type="number"
              value={daysPerMonth}
              onChange={(event) =>
                setDaysPerMonth(Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>{option.model}</strong>
          <span>
            {option.label} · {option.resolution}
          </span>
          <p>{option.note}</p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>ESTIMATED COST</p>
        <div className={styles.primary}>
          <span>월 예상 비용</span>
          <strong>{usd.format(result.monthlyUsd)}</strong>
        </div>
        <dl>
          <div>
            <dt>이미지 1장</dt>
            <dd>{usd.format(option.pricePerImageUsd)}</dd>
          </div>
          <div>
            <dt>하루 비용</dt>
            <dd>{usd.format(result.dailyUsd)}</dd>
          </div>
          <div>
            <dt>월 생성량</dt>
            <dd>{result.imagesPerMonth.toLocaleString("ko-KR")}장</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          실제 청구액은 프롬프트·입력 이미지·Batch 여부·환율·세금에 따라
          달라질 수 있습니다.
        </p>
        <a href={option.sourceUrl} target="_blank" rel="noreferrer">
          공식 가격 확인 · {option.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
