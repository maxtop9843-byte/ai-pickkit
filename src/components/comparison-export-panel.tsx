"use client";

import { useState } from "react";
import {
  buildComparisonExport,
  comparisonExportFilename,
  serializeComparisonCsv,
  serializeComparisonJson,
} from "@/lib/comparison-export";
import type { DirectComparisonInput } from "@/lib/direct-model-comparison";
import styles from "./comparison-export-panel.module.css";

function readCurrentInput(): DirectComparisonInput | null {
  const section = document.querySelector<HTMLElement>(
    '[data-smoke="direct-model-comparison"]',
  );
  if (!section) return null;

  const selects = section.querySelectorAll<HTMLSelectElement>("select");
  const numbers = section.querySelectorAll<HTMLInputElement>('input[type="number"]');
  if (selects.length < 2 || numbers.length < 3) return null;

  return {
    modelAId: selects[0].value,
    modelBId: selects[1].value,
    monthlyRequests: Number(numbers[0].value),
    inputTokensPerRequest: Number(numbers[1].value),
    outputTokensPerRequest: Number(numbers[2].value),
  };
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ComparisonExportPanel() {
  const [message, setMessage] = useState("");

  function exportResult(format: "csv" | "json") {
    const input = readCurrentInput();
    if (!input) {
      setMessage("현재 비교값을 읽지 못했습니다. 페이지를 새로고침해 주세요.");
      return;
    }

    const data = buildComparisonExport(input);
    const filename = comparisonExportFilename(format, data.exportedAt);
    const content =
      format === "csv"
        ? serializeComparisonCsv(data)
        : serializeComparisonJson(data);

    downloadFile(
      filename,
      content,
      format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8",
    );
    setMessage(`${format.toUpperCase()} 파일을 저장했습니다.`);
  }

  return (
    <section className={styles.panel} aria-labelledby="comparison-export-title">
      <div>
        <p>EXPORT</p>
        <h2 id="comparison-export-title">현재 비교 결과 내보내기</h2>
        <span>
          입력값, 모델별 월간 비용, 절감액과 공식 출처를 CSV 또는 JSON으로
          저장합니다.
        </span>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => exportResult("csv")}>
          CSV 다운로드
        </button>
        <button type="button" onClick={() => exportResult("json")}>
          JSON 다운로드
        </button>
      </div>
      <p className={styles.message} aria-live="polite">
        {message}
      </p>
    </section>
  );
}
