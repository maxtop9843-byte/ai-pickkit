export type WorkloadPreset = {
  id: string;
  label: string;
  description: string;
  usersPerDay: number;
  requestsPerUser: number;
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
    description: "하루 100명이 짧은 질문을 5번씩 보내는 초기 서비스",
    usersPerDay: 100,
    requestsPerUser: 5,
    inputTokens: 450,
    outputTokens: 220,
  },
  {
    id: "document",
    label: "문서 요약 서비스",
    description: "하루 40명이 긴 문서 3건을 요약하는 업무 도구",
    usersPerDay: 40,
    requestsPerUser: 3,
    inputTokens: 6000,
    outputTokens: 700,
  },
  {
    id: "coding",
    label: "코딩 에이전트",
    description: "하루 25명이 코드 작업을 12번 요청하는 개발 도구",
    usersPerDay: 25,
    requestsPerUser: 12,
    inputTokens: 9000,
    outputTokens: 2500,
  },
  {
    id: "vision",
    label: "이미지 분석 서비스",
    description: "하루 60명이 이미지 4장을 분석하는 멀티모달 서비스",
    usersPerDay: 60,
    requestsPerUser: 4,
    inputTokens: 1800,
    outputTokens: 500,
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

const defaultPreset = workloadPresets[0];

export const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  presetId: defaultPreset.id,
  usersPerDay: defaultPreset.usersPerDay,
  requestsPerUser: defaultPreset.requestsPerUser,
  inputTokens: defaultPreset.inputTokens,
  outputTokens: defaultPreset.outputTokens,
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

export function stateFromPreset(preset: WorkloadPreset): CalculatorState {
  return {
    presetId: preset.id,
    usersPerDay: preset.usersPerDay,
    requestsPerUser: preset.requestsPerUser,
    inputTokens: preset.inputTokens,
    outputTokens: preset.outputTokens,
  };
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
      preset.usersPerDay,
      CALCULATOR_LIMITS.usersPerDay,
    ),
    requestsPerUser: parseBoundedInteger(
      params.get("requests"),
      preset.requestsPerUser,
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
