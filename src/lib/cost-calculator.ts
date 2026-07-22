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
