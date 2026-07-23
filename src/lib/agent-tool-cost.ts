export type AgentModelPrice = {
  id: string;
  provider: "OpenAI";
  model: string;
  inputPerMillionTokensUsd: number;
  outputPerMillionTokensUsd: number;
  sourceUrl: string;
  verifiedAt: string;
};

export type AgentToolCostInput = {
  monthlyTasks: number;
  modelCallsPerTask: number;
  inputTokensPerCall: number;
  outputTokensPerCall: number;
  webSearchCallsPerTask: number;
  codeSessionsPerTask: number;
  otherToolCallsPerTask: number;
  otherToolCostPerCallUsd: number;
};

const sourceUrl = "https://developers.openai.com/api/docs/pricing";

export const agentModelPrices: AgentModelPrice[] = [
  {
    id: "gpt-5.6-luna",
    provider: "OpenAI",
    model: "GPT-5.6 Luna",
    inputPerMillionTokensUsd: 1,
    outputPerMillionTokensUsd: 6,
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
  {
    id: "gpt-5.6-terra",
    provider: "OpenAI",
    model: "GPT-5.6 Terra",
    inputPerMillionTokensUsd: 2.5,
    outputPerMillionTokensUsd: 15,
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
  {
    id: "gpt-5.6-sol",
    provider: "OpenAI",
    model: "GPT-5.6 Sol",
    inputPerMillionTokensUsd: 5,
    outputPerMillionTokensUsd: 30,
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
];

export const WEB_SEARCH_COST_PER_CALL_USD = 0.01;
export const CODE_INTERPRETER_COST_PER_SESSION_USD = 0.03;

function positive(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateAgentToolCost(
  model: AgentModelPrice,
  input: AgentToolCostInput,
) {
  const monthlyTasks = Math.floor(positive(input.monthlyTasks));
  const modelCallsPerTask = positive(input.modelCallsPerTask);
  const inputTokensPerCall = positive(input.inputTokensPerCall);
  const outputTokensPerCall = positive(input.outputTokensPerCall);
  const webSearchCallsPerTask = positive(input.webSearchCallsPerTask);
  const codeSessionsPerTask = positive(input.codeSessionsPerTask);
  const otherToolCallsPerTask = positive(input.otherToolCallsPerTask);
  const otherToolCostPerCallUsd = positive(input.otherToolCostPerCallUsd);

  const totalModelCalls = monthlyTasks * modelCallsPerTask;
  const inputTokens = totalModelCalls * inputTokensPerCall;
  const outputTokens = totalModelCalls * outputTokensPerCall;
  const modelInputUsd =
    (inputTokens / 1_000_000) * model.inputPerMillionTokensUsd;
  const modelOutputUsd =
    (outputTokens / 1_000_000) * model.outputPerMillionTokensUsd;
  const webSearchUsd =
    monthlyTasks * webSearchCallsPerTask * WEB_SEARCH_COST_PER_CALL_USD;
  const codeExecutionUsd =
    monthlyTasks *
    codeSessionsPerTask *
    CODE_INTERPRETER_COST_PER_SESSION_USD;
  const otherToolsUsd =
    monthlyTasks * otherToolCallsPerTask * otherToolCostPerCallUsd;
  const monthlyTotalUsd =
    modelInputUsd +
    modelOutputUsd +
    webSearchUsd +
    codeExecutionUsd +
    otherToolsUsd;

  return {
    totalModelCalls,
    inputTokens,
    outputTokens,
    modelInputUsd,
    modelOutputUsd,
    webSearchUsd,
    codeExecutionUsd,
    otherToolsUsd,
    monthlyTotalUsd,
    costPerTaskUsd: monthlyTasks > 0 ? monthlyTotalUsd / monthlyTasks : 0,
  };
}
