import { catalogModels, type CatalogModel } from "./model-catalog";

export type BudgetCapacityInput = {
  monthlyBudgetUsd: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  requestsPerUser: number;
};

export type BudgetCapacityRow = {
  model: CatalogModel;
  costPerRequestUsd: number;
  maxMonthlyRequests: number;
  maxMonthlyUsers: number;
  remainingBudgetUsd: number;
};

const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateBudgetCapacity(input: BudgetCapacityInput) {
  const monthlyBudgetUsd = nonNegative(input.monthlyBudgetUsd);
  const inputTokensPerRequest = nonNegative(input.inputTokensPerRequest);
  const outputTokensPerRequest = nonNegative(input.outputTokensPerRequest);
  const requestsPerUser = Math.max(
    1,
    Math.floor(nonNegative(input.requestsPerUser)),
  );

  const rows: BudgetCapacityRow[] = catalogModels
    .map((model) => {
      const costPerRequestUsd =
        (inputTokensPerRequest * model.inputPerMillion +
          outputTokensPerRequest * model.outputPerMillion) /
        1_000_000;
      const maxMonthlyRequests =
        costPerRequestUsd > 0
          ? Math.floor(monthlyBudgetUsd / costPerRequestUsd)
          : 0;
      const maxMonthlyUsers = Math.floor(maxMonthlyRequests / requestsPerUser);
      const remainingBudgetUsd = Math.max(
        0,
        monthlyBudgetUsd - maxMonthlyRequests * costPerRequestUsd,
      );

      return {
        model,
        costPerRequestUsd,
        maxMonthlyRequests,
        maxMonthlyUsers,
        remainingBudgetUsd,
      };
    })
    .sort(
      (a, b) =>
        b.maxMonthlyUsers - a.maxMonthlyUsers ||
        b.maxMonthlyRequests - a.maxMonthlyRequests ||
        a.costPerRequestUsd - b.costPerRequestUsd,
    );

  return {
    monthlyBudgetUsd,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerUser,
    rows,
    recommended: rows[0] ?? null,
  };
}
