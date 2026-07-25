import type { CatalogModel, Provider, ProviderSource } from "./model-catalog";

export type SourceCheck = {
  provider: Provider;
  url: string;
  ok: boolean;
  status: number | null;
  checkedAt: string;
  error?: string;
};

export type FreshnessReportInput = {
  models: CatalogModel[];
  sources: Record<Provider, ProviderSource>;
  catalogVerifiedAt: string;
  sourceChecks: SourceCheck[];
  now: Date;
  staleAfterDays?: number;
};

export type FreshnessCandidate = {
  provider: Provider;
  modelId: string;
  modelName: string;
  sourceUrl: string;
  verifiedAt: string;
  ageDays: number;
  reasons: string[];
};

export type FreshnessReport = {
  generatedAt: string;
  catalogVerifiedAt: string;
  staleAfterDays: number;
  candidates: FreshnessCandidate[];
  sourceChecks: SourceCheck[];
  markdown: string;
};

function ageInDays(verifiedAt: string, now: Date) {
  const verified = new Date(`${verifiedAt}T00:00:00.000Z`);
  if (Number.isNaN(verified.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - verified.getTime()) / 86_400_000);
}

function escapeCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function buildPriceFreshnessReport({
  models,
  sources,
  catalogVerifiedAt,
  sourceChecks,
  now,
  staleAfterDays = 14,
}: FreshnessReportInput): FreshnessReport {
  const checksByProvider = new Map(
    sourceChecks.map((check) => [check.provider, check]),
  );
  const candidates: FreshnessCandidate[] = [];

  for (const model of models) {
    const reasons: string[] = [];
    const ageDays = ageInDays(model.verifiedAt, now);
    const source = sources[model.provider];
    const check = checksByProvider.get(model.provider);

    if (!Number.isFinite(ageDays)) reasons.push("검증일 형식 오류");
    else if (ageDays > staleAfterDays)
      reasons.push(`검증 후 ${ageDays}일 경과`);

    if (!check) reasons.push("출처 확인 결과 없음");
    else if (!check.ok) {
      reasons.push(
        check.status === null
          ? `출처 접근 실패${check.error ? `: ${check.error}` : ""}`
          : `출처 HTTP ${check.status}`,
      );
    }

    if (reasons.length > 0) {
      candidates.push({
        provider: model.provider,
        modelId: model.id,
        modelName: model.name,
        sourceUrl: source.url,
        verifiedAt: model.verifiedAt,
        ageDays,
        reasons,
      });
    }
  }

  const generatedAt = now.toISOString();
  const lines = [
    "# AI PickKit 가격 데이터 신선도 점검",
    "",
    `- 생성 시각: ${generatedAt}`,
    `- 카탈로그 기준 검증일: ${catalogVerifiedAt}`,
    `- 변경 후보 기준: 검증 후 ${staleAfterDays}일 초과 또는 공식 출처 접근 실패`,
    "- 안전 원칙: 이 보고서는 변경 후보만 제시하며 가격 데이터를 자동 수정하지 않습니다.",
    "",
    "## 공식 출처 상태",
    "",
    "| 공급자 | 상태 | HTTP | 확인 시각 | 공식 근거 |",
    "| --- | --- | ---: | --- | --- |",
    ...sourceChecks.map((check) =>
      [
        check.provider,
        check.ok ? "정상" : "점검 필요",
        check.status ?? "-",
        check.checkedAt,
        check.url,
      ]
        .map((value) => escapeCell(String(value)))
        .join(" | ")
        .replace(/^/, "| ")
        .concat(" |"),
    ),
    "",
    "## 변경 후보",
    "",
  ];

  if (candidates.length === 0) {
    lines.push("현재 자동 점검 기준에서 변경 후보가 없습니다.");
  } else {
    lines.push(
      "| 공급자 | 모델 | 현재 검증일 | 경과일 | 후보 사유 | 공식 근거 |",
      "| --- | --- | --- | ---: | --- | --- |",
      ...candidates.map((candidate) =>
        [
          candidate.provider,
          `${candidate.modelName} (${candidate.modelId})`,
          candidate.verifiedAt,
          Number.isFinite(candidate.ageDays) ? candidate.ageDays : "-",
          candidate.reasons.join(", "),
          candidate.sourceUrl,
        ]
          .map((value) => escapeCell(String(value)))
          .join(" | ")
          .replace(/^/, "| ")
          .concat(" |"),
      ),
    );
  }

  lines.push(
    "",
    "## 다음 행동",
    "",
    "1. 변경 후보가 있으면 각 공급자의 공식 가격 문서를 사람이 확인합니다.",
    "2. 실제 가격 또는 정책 변경이 확인된 경우 별도 PR에서 근거와 검증일을 함께 갱신합니다.",
    "3. 공식 근거를 확인하지 못한 값은 게시하거나 추측해 수정하지 않습니다.",
    "",
  );

  return {
    generatedAt,
    catalogVerifiedAt,
    staleAfterDays,
    candidates,
    sourceChecks,
    markdown: lines.join("\n"),
  };
}
