import Link from "next/link";
import {
  serializeCalculatorState,
  stateFromPreset,
  workloadPresets,
} from "@/lib/cost-calculator";

export default function ServiceUsagePresets({ activeId }: { activeId: string }) {
  return (
    <section
      className="calculator-shell"
      aria-labelledby="service-presets-title"
      data-smoke="service-usage-presets"
    >
      <div className="calculator-intro">
        <p className="section-kicker">REAL SERVICE STARTING POINTS · APK-010</p>
        <h2 id="service-presets-title">실제 서비스 규모에서 시작하세요</h2>
        <p>
          챗봇, 문서 요약, 코딩, 이미지 분석의 대표 이용량을 한 번에 불러온 뒤
          아래 계산기에서 모든 값을 자유롭게 수정할 수 있습니다.
        </p>
      </div>
      <div className="preset-grid">
        {workloadPresets.map((preset) => {
          const state = stateFromPreset(preset);
          const href = `/api-cost-calculator?${serializeCalculatorState(state).toString()}`;
          return (
            <Link
              className={activeId === preset.id ? "preset active" : "preset"}
              href={href}
              key={preset.id}
              aria-current={activeId === preset.id ? "page" : undefined}
            >
              <strong>{preset.label}</strong>
              <span>{preset.description}</span>
              <small>
                하루 {preset.usersPerDay.toLocaleString("ko-KR")}명 · 1명당 {preset.requestsPerUser}회 · 입력 {preset.inputTokens.toLocaleString("ko-KR")} · 출력 {preset.outputTokens.toLocaleString("ko-KR")} 토큰
              </small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
