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

export function normalizeAgentToolCostInput(
  key: keyof AgentToolCostInput,
  value: number,
) {
  const finiteValue = Number.isFinite(value) ? value : 0;
  const nonNegativeValue = Math.max(0, finiteValue);

  return key === "monthlyTasks"
    ? Math.floor(nonNegativeValue)
    : nonNegativeValue;
}

export function calculateAgentToolCost(
  model: AgentModelPrice,
  input: AgentToolCostInput,
) {
  const monthlyTasks = normalizeAgentToolCostInput(
    "monthlyTasks",
    input.monthlyTasks,
  );
  const modelCallsPerTask = normalizeAgentToolCostInput(
    "modelCallsPerTask",
    input.modelCallsPerTask,
  );
  const inputTokensPerCall = normalizeAgentToolCostInput(
    "inputTokensPerCall",
    input.inputTokensPerCall,
  );
  const outputTokensPerCall = normalizeAgentToolCostInput(
    "outputTokensPerCall",
    input.outputTokensPerCall,
  );
  const webSearchCallsPerTask = normalizeAgentToolCostInput(
    "webSearchCallsPerTask",
    input.webSearchCallsPerTask,
  );
  const codeSessionsPerTask = normalizeAgentToolCostInput(
    "codeSessionsPerTask",
    input.codeSessionsPerTask,
  );
  const otherToolCallsPerTask = normalizeAgentToolCostInput(
    "otherToolCallsPerTask",
    input.otherToolCallsPerTask,
  );
  const otherToolCostPerCallUsd = normalizeAgentToolCostInput(
    "otherToolCostPerCallUsd",
    input.otherToolCostPerCallUsd,
  );

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
    monthlyTasks * codeSessionsPerTask * CODE_INTERPRETER_COST_PER_SESSION_USD;
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
