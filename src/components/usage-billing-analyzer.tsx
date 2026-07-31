"use client";

import { useMemo, useState } from "react";
import styles from "./image-cost-calculator.module.css";

type UsageRow = {
  date: string;
  provider: string;
  model: string;
  cost: number;
};

function parseRows(text: string, fileName: string): UsageRow[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text) as unknown;
    const values = Array.isArray(parsed) ? parsed : [parsed];
    return values.map((value, index) => normalizeRow(value, index));
  }

  const [headerLine = "", ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine
    .split(",")
    .map((item) => item.trim().toLowerCase());
  return lines
    .filter(Boolean)
    .map((line, index) => {
      const values = line.split(",").map((item) => item.trim());
      return normalizeRow(
        Object.fromEntries(
          headers.map((header, column) => [header, values[column]]),
        ),
        index,
      );
    });
}

function normalizeRow(value: unknown, index: number): UsageRow {
  if (!value || typeof value !== "object") {
    throw new Error(`${index + 1}번째 행을 읽을 수 없습니다.`);
  }
  const record = value as Record<string, unknown>;
  const cost = Number(record.cost ?? record.amount ?? record.usd ?? 0);
  if (!Number.isFinite(cost) || cost < 0) {
    throw new Error(`${index + 1}번째 행의 비용이 올바르지 않습니다.`);
  }
  return {
    date: String(
      record.date ?? record.created_at ?? record.timestamp ?? "날짜 없음",
    ),
    provider: String(record.provider ?? record.vendor ?? "기타"),
    model: String(record.model ?? record.service ?? "미분류"),
    cost,
  };
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

// prettier-ignore
export default function UsageBillingAnalyzer() {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + row.cost, 0);
    const byProvider = new Map<string, number>();
    rows.forEach((row) =>
      byProvider.set(
        row.provider,
        (byProvider.get(row.provider) ?? 0) + row.cost,
      ),
    );
    const sorted = [...byProvider.entries()].sort((a, b) => b[1] - a[1]);
    const datedRows = rows.filter((row) => !Number.isNaN(Date.parse(row.date)));
    const dates = datedRows.map((row) => Date.parse(row.date));
    const spanDays =
      dates.length > 1
        ? Math.max(
            1,
            (Math.max(...dates) - Math.min(...dates)) / 86_400_000 + 1,
          )
        : 1;
    const projected = total > 0 ? (total / spanDays) * 30 : 0;
    return { total, projected, sorted };
  }, [rows]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      const parsed = parseRows(await file.text(), file.name);
      if (parsed.length === 0) throw new Error("분석할 행이 없습니다.");
      setRows(parsed);
    } catch (caught) {
      setRows([]);
      setError(
        caught instanceof Error ? caught.message : "파일을 읽지 못했습니다.",
      );
    }
  }

  return (
    <section className={styles.shell} data-smoke="usage-billing-analyzer">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>LOCAL BILLING ANALYSIS</p>
          <h2>CSV·JSON 청구 내역을 브라우저에서 바로 분석하세요</h2>
          <span>
            파일은 서버로 전송하지 않습니다. date, provider, model, cost 열을
            권장합니다.
          </span>
        </div>
        <label className={styles.field}>
          <span>청구 내역 파일</span>
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <div className={styles.selection}>
          <strong>지원 형식</strong>
          <span>CSV: date,provider,model,cost</span>
          <p>
            JSON은 같은 필드를 가진 객체 배열을 지원하며
            amount·usd·vendor·service도 자동 인식합니다.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>SPEND SUMMARY</p>
        <div className={styles.primary}>
          <span>
            {rows.length
              ? `${rows.length.toLocaleString("ko-KR")}개 사용 기록`
              : "파일을 가져오세요"}
          </span>
          <strong>{usd.format(result.total)}</strong>
        </div>
        <dl>
          <div>
            <dt>가져온 지출 합계</dt>
            <dd>{usd.format(result.total)}</dd>
          </div>
          <div>
            <dt>현재 속도 기준 30일 예상</dt>
            <dd>{usd.format(result.projected)}</dd>
          </div>
          <div>
            <dt>가장 큰 공급자</dt>
            <dd>{result.sorted[0]?.[0] ?? "없음"}</dd>
          </div>
        </dl>
        {result.sorted.length ? (
          <div>
            {result.sorted.slice(0, 5).map(([provider, cost]) => (
              <p key={provider}>
                {provider}: <strong>{usd.format(cost)}</strong>
              </p>
            ))}
          </div>
        ) : null}
        <p className={styles.caveat}>
          월말 예상은 파일의 최초·최종 날짜 범위를 기준으로 단순 환산한
          참고값입니다.
        </p>
      </aside>
    </section>
  );
}
