export type WorkloadPreset = {
  id: string;
  label: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
};

import {
  CATALOG_VERIFIED_AT,
  getCatalogModel,
  type CatalogModel,
} from "./model-catalog";

export type CalculatorModel = CatalogModel & {
  calculatorTier: "low" | "balanced" | "quality";
  calculatorTierLabel: string;
};

export const VERIFIED_AT = CATALOG_VERIFIED_AT;

export const workloadPresets: WorkloadPreset[] = [
  {
    id: "support",
    label: "고객 문의 챗봇",
    description: "짧은 질문에 간결하게 답해요",
    inputTokens: 450,
    outputTokens: 220,
  },
  {
    id: "writing",
    label: "글쓰기 도우미",
    description: "자료를 읽고 긴 초안을 만들어요",
    inputTokens: 1200,
    outputTokens: 900,
  },
  {
    id: "document",
    label: "문서 분석",
    description: "긴 문서에서 핵심을 찾아 답해요",
    inputTokens: 6000,
    outputTokens: 700,
  },
  {
    id: "coding",
    label: "코딩 에이전트",
    description: "코드를 읽고 여러 단계로 작업해요",
    inputTokens: 9000,
    outputTokens: 2500,
  },
];

const calculatorChoices = [
  {
    id: "claude-haiku-4-5",
    calculatorTier: "low",
    calculatorTierLabel: "저비용",
  },
  {
    id: "claude-sonnet-5",
    calculatorTier: "balanced",
    calculatorTierLabel: "균형형",
  },
  {
    id: "claude-opus-4-8",
    calculatorTier: "quality",
    calculatorTierLabel: "고품질",
  },
] as const;

export const modelPrices: CalculatorModel[] = calculatorChoices.map(
  ({ id, calculatorTier, calculatorTierLabel }) => ({
    ...getCatalogModel(id),
    calculatorTier,
    calculatorTierLabel,
  }),
);

export type CostInput = {
  usersPerDay: number;
  requestsPerUser: number;
  inputTokens: number;
  outputTokens: number;
};

export type CalculatorState = CostInput & {
  presetId: string;
};

export const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  presetId: "support",
  usersPerDay: 100,
  requestsPerUser: 5,
  inputTokens: 450,
  outputTokens: 220,
};

export const CALCULATOR_LIMITS = {
  usersPerDay: 10_000_000,
  requestsPerUser: 10_000,
  inputTokens: 10_000_000,
  outputTokens: 10_000_000,
} as const;

function parseBoundedInteger(
  value: string | null,
  fallback: number,
  maximum: number,
) {
  if (value === null || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= maximum ? parsed : fallback;
}

export function parseCalculatorState(search: string | URLSearchParams) {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const preset =
    workloadPresets.find((item) => item.id === params.get("preset")) ??
    workloadPresets[0];

  return {
    presetId: preset.id,
    usersPerDay: parseBoundedInteger(
      params.get("users"),
      DEFAULT_CALCULATOR_STATE.usersPerDay,
      CALCULATOR_LIMITS.usersPerDay,
    ),
    requestsPerUser: parseBoundedInteger(
      params.get("requests"),
      DEFAULT_CALCULATOR_STATE.requestsPerUser,
      CALCULATOR_LIMITS.requestsPerUser,
    ),
    inputTokens: parseBoundedInteger(
      params.get("input"),
      preset.inputTokens,
      CALCULATOR_LIMITS.inputTokens,
    ),
    outputTokens: parseBoundedInteger(
      params.get("output"),
      preset.outputTokens,
      CALCULATOR_LIMITS.outputTokens,
    ),
  } satisfies CalculatorState;
}

export function serializeCalculatorState(state: CalculatorState) {
  return new URLSearchParams({
    preset: state.presetId,
    users: String(state.usersPerDay),
    requests: String(state.requestsPerUser),
    input: String(state.inputTokens),
    output: String(state.outputTokens),
  });
}

export function createCalculatorShareUrl(
  state: CalculatorState,
  origin = "https://aipickkit.com",
) {
  const url = new URL("/api-cost-calculator", origin);
  url.search = serializeCalculatorState(state).toString();
  return url.toString();
}

export function calculateCost(input: CostInput, model: CatalogModel) {
  const requestsPerDay = input.usersPerDay * input.requestsPerUser;
  const requestCost =
    (input.inputTokens * model.inputPerMillion +
      input.outputTokens * model.outputPerMillion) /
    1_000_000;
  const daily = requestCost * requestsPerDay;
  const monthly = daily * 30;
  const cachedMonthly =
    ((input.inputTokens * 0.3 * model.inputPerMillion +
      input.inputTokens *
        0.7 *
        (model.cachedInputPerMillion ?? model.inputPerMillion) +
      input.outputTokens * model.outputPerMillion) /
      1_000_000) *
    requestsPerDay *
    30;

  return {
    requestsPerDay,
    requestCost,
    daily,
    monthly,
    perUserMonthly: input.usersPerDay > 0 ? monthly / input.usersPerDay : 0,
    batchMonthly: model.batch ? monthly * 0.5 : monthly,
    cachedMonthly,
  };
}
