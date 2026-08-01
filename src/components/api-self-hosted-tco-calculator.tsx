"use client";

import { useMemo, useState } from "react";
import styles from "./image-cost-calculator.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function ApiSelfHostedTcoCalculator() {
  const [monthlyRequests, setMonthlyRequests] = useState(100000);
  const [apiCostPerThousand, setApiCostPerThousand] = useState(4.5);
  const [gpuHourlyCost, setGpuHourlyCost] = useState(1.2);
  const [gpuCount, setGpuCount] = useState(1);
  const [utilization, setUtilization] = useState(55);
  const [requestsPerSecond, setRequestsPerSecond] = useState(2.5);
  const [opsMonthly, setOpsMonthly] = useState(250);

  const result = useMemo(() => {
    const safeRequests = Math.max(0, monthlyRequests || 0);
    const safeApiRate = Math.max(0, apiCostPerThousand || 0);
    const safeGpuHourly = Math.max(0, gpuHourlyCost || 0);
    const safeGpuCount = Math.max(0, gpuCount || 0);
    const safeUtilization = Math.min(100, Math.max(1, utilization || 1));
    const safeRps = Math.max(0.01, requestsPerSecond || 0.01);
    const safeOps = Math.max(0, opsMonthly || 0);

    const apiMonthly = (safeRequests / 1000) * safeApiRate;
    const gpuMonthly = safeGpuHourly * safeGpuCount * 730;
    const selfHostedMonthly = gpuMonthly + safeOps;
    const monthlyCapacity =
      safeRps * 60 * 60 * 730 * safeGpuCount * (safeUtilization / 100);
    const capacityUsage =
      monthlyCapacity > 0 ? safeRequests / monthlyCapacity : 0;
    const breakEvenRequests =
      safeApiRate > 0 ? (selfHostedMonthly / safeApiRate) * 1000 : null;

    return {
      apiMonthly,
      selfHostedMonthly,
      monthlyCapacity,
      capacityUsage,
      breakEvenRequests,
      selfHostedIsCheaper: selfHostedMonthly < apiMonthly,
      difference: Math.abs(selfHostedMonthly - apiMonthly),
    };
  }, [
    apiCostPerThousand,
    gpuCount,
    gpuHourlyCost,
    monthlyRequests,
    opsMonthly,
    requestsPerSecond,
    utilization,
  ]);

  return (
    <section className={styles.shell} data-smoke="api-self-hosted-tco">
      <div className={styles.controls}>
        <div className={styles.heading}>
          <p>API OR SELF-HOSTED</p>
          <h2>같은 월간 요청량을 API와 자체 호스팅 비용으로 비교하세요</h2>
          <span>
            공급자 API 단가와 GPU 임대료, 운영비, 실제 처리량을 직접 입력해
            손익분기점과 용량 여유를 계산합니다.
          </span>
        </div>

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
            <span>API 1,000회당 비용 (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={apiCostPerThousand}
              onChange={(event) =>
                setApiCostPerThousand(Number(event.target.value))
              }
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>GPU 시간당 비용 (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={gpuHourlyCost}
              onChange={(event) =>
                setGpuHourlyCost(Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>GPU 수</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={gpuCount}
              onChange={(event) => setGpuCount(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>목표 이용률 (%)</span>
            <input
              type="number"
              min="1"
              max="100"
              inputMode="numeric"
              value={utilization}
              onChange={(event) => setUtilization(Number(event.target.value))}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>GPU 1대당 처리량 (req/s)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={requestsPerSecond}
              onChange={(event) =>
                setRequestsPerSecond(Number(event.target.value))
              }
            />
          </label>
          <label className={styles.field}>
            <span>월 운영·스토리지 비용 (USD)</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={opsMonthly}
              onChange={(event) => setOpsMonthly(Number(event.target.value))}
            />
          </label>
        </div>

        <div className={styles.selection}>
          <strong>계산 기준</strong>
          <span>월 730시간 · 입력한 이용률만 실제 처리 가능 용량으로 반영</span>
          <p>
            모델 품질, 장애 대응, 네트워크, 개발 인건비, 스케일링 여유와 초기
            구축비는 별도로 검토해야 합니다.
          </p>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.kicker}>MONTHLY TCO</p>
        <div className={styles.primary}>
          <span>
            {result.selfHostedIsCheaper
              ? "자체 호스팅 예상 비용이 더 낮습니다"
              : "API 예상 비용이 더 낮습니다"}
          </span>
          <strong>
            {usd.format(
              result.selfHostedIsCheaper
                ? result.selfHostedMonthly
                : result.apiMonthly,
            )}
          </strong>
        </div>
        <dl>
          <div>
            <dt>API 월 예상 비용</dt>
            <dd>{usd.format(result.apiMonthly)}</dd>
          </div>
          <div>
            <dt>자체 호스팅 월 TCO</dt>
            <dd>{usd.format(result.selfHostedMonthly)}</dd>
          </div>
          <div>
            <dt>월 차이</dt>
            <dd>{usd.format(result.difference)}</dd>
          </div>
          <div>
            <dt>월 처리 가능 용량</dt>
            <dd>
              {Math.round(result.monthlyCapacity).toLocaleString("ko-KR")}회
            </dd>
          </div>
          <div>
            <dt>예상 용량 사용률</dt>
            <dd>{(result.capacityUsage * 100).toFixed(1)}%</dd>
          </div>
          <div>
            <dt>금액상 손익분기 요청 수</dt>
            <dd>
              {result.breakEvenRequests === null
                ? "API 단가를 입력하세요"
                : `${Math.round(result.breakEvenRequests).toLocaleString(
                    "ko-KR",
                  )}회`}
            </dd>
          </div>
        </dl>
        <p className={styles.caveat}>
          기본값은 예시일 뿐이며 특정 GPU나 모델의 공식 가격을 의미하지 않습니다.
          실제 공급자 견적과 벤치마크 값으로 교체해 사용하세요.
        </p>
      </aside>
    </section>
  );
}
