export type ProviderPrice = {
  id: "openai" | "anthropic" | "google";
  provider: string;
  model: string;
  inputPerMillionTokensUsd: number;
  outputPerMillionTokensUsd: number;
  sourceUrl: string;
  verifiedAt: string;
};

export type ProviderBudgetInput = {
  monthlyRequests: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  monthlyBudgetUsd: number;
};

export const providerPrices: ProviderPrice[] = [
  {
    id: "openai",
    provider: "OpenAI",
    model: "GPT-5.6 Terra",
    inputPerMillionTokensUsd: 2.5,
    outputPerMillionTokensUsd: 15,
    sourceUrl: "https://openai.com/api/pricing/",
    verifiedAt: "2026-07-24",
  },
  {
    id: "anthropic",
    provider: "Anthropic",
    model: "Claude Sonnet 4",
    inputPerMillionTokensUsd: 3,
    outputPerMillionTokensUsd: 15,
    sourceUrl: "https://www.anthropic.com/pricing",
    verifiedAt: "2026-07-24",
  },
  {
    id: "google",
    provider: "Google",
    model: "Gemini 3.5 Flash",
    inputPerMillionTokensUsd: 0.5,
    outputPerMillionTokensUsd: 3,
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-24",
  },
];

function positive(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function compareProviderBudgets(input: ProviderBudgetInput) {
  const monthlyRequests = Math.floor(positive(input.monthlyRequests));
  const inputTokensPerRequest = positive(input.inputTokensPerRequest);
  const outputTokensPerRequest = positive(input.outputTokensPerRequest);
  const monthlyBudgetUsd = positive(input.monthlyBudgetUsd);
  const monthlyInputTokens = monthlyRequests * inputTokensPerRequest;
  const monthlyOutputTokens = monthlyRequests * outputTokensPerRequest;

  return providerPrices
    .map((price) => {
      const inputCostUsd =
        (monthlyInputTokens / 1_000_000) * price.inputPerMillionTokensUsd;
      const outputCostUsd =
        (monthlyOutputTokens / 1_000_000) * price.outputPerMillionTokensUsd;
      const monthlyCostUsd = inputCostUsd + outputCostUsd;
      const costPerRequestUsd =
        monthlyRequests > 0 ? monthlyCostUsd / monthlyRequests : 0;
      const budgetRemainingUsd = monthlyBudgetUsd - monthlyCostUsd;

      return {
        ...price,
        inputCostUsd,
        outputCostUsd,
        monthlyCostUsd,
        costPerRequestUsd,
        budgetRemainingUsd,
        withinBudget: monthlyCostUsd <= monthlyBudgetUsd,
      };
    })
    .sort((a, b) => a.monthlyCostUsd - b.monthlyCostUsd);
}
