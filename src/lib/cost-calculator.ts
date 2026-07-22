export type WorkloadPreset = {
  id: string;
  label: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
};

export type ModelPrice = {
  id: string;
  name: string;
  provider: string;
  tier: "low" | "balanced" | "quality";
  tierLabel: string;
  note: string;
  inputPerMillion: number;
  cachedInputPerMillion: number;
  outputPerMillion: number;
  source: string;
};

export const VERIFIED_AT = "2026-07-22";

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

export const modelPrices: ModelPrice[] = [
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    tier: "low",
    tierLabel: "저비용",
    note: "빠른 분류·요약과 대량 처리",
    inputPerMillion: 1,
    cachedInputPerMillion: 0.1,
    outputPerMillion: 5,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    tier: "balanced",
    tierLabel: "균형형",
    note: "일반 서비스와 코딩에 고른 선택",
    inputPerMillion: 2,
    cachedInputPerMillion: 0.2,
    outputPerMillion: 10,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    tier: "quality",
    tierLabel: "고품질",
    note: "복잡하고 정확도가 중요한 작업",
    inputPerMillion: 5,
    cachedInputPerMillion: 0.5,
    outputPerMillion: 25,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
];

export type CostInput = {
  usersPerDay: number;
  requestsPerUser: number;
  inputTokens: number;
  outputTokens: number;
};

export function calculateCost(input: CostInput, model: ModelPrice) {
  const requestsPerDay = input.usersPerDay * input.requestsPerUser;
  const requestCost =
    (input.inputTokens * model.inputPerMillion +
      input.outputTokens * model.outputPerMillion) /
    1_000_000;
  const daily = requestCost * requestsPerDay;
  const monthly = daily * 30;
  const cachedMonthly =
    ((input.inputTokens * 0.3 * model.inputPerMillion +
      input.inputTokens * 0.7 * model.cachedInputPerMillion +
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
    batchMonthly: monthly * 0.5,
    cachedMonthly,
  };
}
