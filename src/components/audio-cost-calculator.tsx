"use client";

import { useMemo, useState } from "react";
import {
  audioPriceOptions,
  calculateAudioCost,
  type AudioMode,
} from "@/lib/audio-cost";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const languageNotes: Record<string, string> = {
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  multi: "다국어",
};

export default function AudioCostCalculator() {
  const [mode, setMode] = useState<AudioMode>("stt");
  const [optionId, setOptionId] = useState("google-stt-v2-standard");
  const [language, setLanguage] = useState("ko");
  const [amountPerDay, setAmountPerDay] = useState(60);
  const [daysPerMonth, setDaysPerMonth] = useState(30);

  const options = audioPriceOptions.filter((item) => item.mode === mode);
  const option = options.find((item) => item.id === optionId) ?? options[0];
  const result = useMemo(
    () => calculateAudioCost(option, amountPerDay, daysPerMonth),
    [amountPerDay, daysPerMonth, option],
  );

  function changeMode(nextMode: AudioMode) {
    setMode(nextMode);
    const first = audioPriceOptions.find((item) => item.mode === nextMode);
    if (first) setOptionId(first.id);
    setAmountPerDay(nextMode === "stt" ? 60 : 10000);
  }

  const amountLabel = mode === "stt" ? "하루 처리 오디오(분)" : "하루 합성 문자 수";
  const monthlyUnit = mode === "stt" ? "분" : "자";

  return (
    <section className={styles.shell} data-smoke="audio-cost-calculator">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>VOICE WORKLOAD</p>
          <h2>음성 사용량을 입력하세요</h2>
          <span>
            음성 인식은 처리 분량, TTS는 공백을 포함한 문자 수 기준으로 계산합니다.
          </span>
        </div>

        <label className={styles.field}>
          <span>작업 유형</span>
          <select value={mode} onChange={(event) => changeMode(event.target.value as AudioMode)}>
            <option value="stt">음성 인식 (STT)</option>
            <option value="tts">텍스트 음성 변환 (TTS)</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>모델</span>
          <select value={option.id} onChange={(event) => setOptionId(event.target.value)}>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.provider} · {item.model}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>언어</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {Object.entries(languageNotes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{amountLabel}</span>
            <input
              min="0"
              inputMode="numeric"
              type="number"
              value={amountPerDay}
              onChange={(event) => setAmountPerDay(Number(event.target.value))}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>월 운영일</span>
          <input
            min="1"
            max="31"
            inputMode="numeric"
            type="number"
            value={daysPerMonth}
            onChange={(event) => setDaysPerMonth(Number(event.target.value))}
          />
        </label>

        <div className={styles.selection}>
          <strong>{option.model}</strong>
          <span>
            {languageNotes[language]} · {option.unitLabel} {usd.format(option.pricePerUnitUsd)}
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
            <dt>하루 비용</dt>
            <dd>{usd.format(result.dailyUsd)}</dd>
          </div>
          <div>
            <dt>월 처리량</dt>
            <dd>
              {result.monthlyAmount.toLocaleString("ko-KR")}
              {monthlyUnit}
            </dd>
          </div>
          <div>
            <dt>선택 언어</dt>
            <dd>{languageNotes[language]}</dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          언어 선택은 사용 시나리오 기록용입니다. 표시 단가는 언어별 차등을 적용하지 않으며,
          무료 구간·다중 채널·SSML·세금은 제외합니다.
        </p>
        <a href={option.sourceUrl} target="_blank" rel="noreferrer">
          공식 가격 확인 · {option.verifiedAt}
        </a>
      </aside>
    </section>
  );
}
