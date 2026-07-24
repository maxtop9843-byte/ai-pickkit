export type FreeCreditRunwayInput = {
  balanceUsd: number;
  dailyUsageUsd: number;
  dailyGrowthPercent: number;
  warningThresholdDays: number;
};

const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateFreeCreditRunway(input: FreeCreditRunwayInput) {
  const balanceUsd = nonNegative(input.balanceUsd);
  const startingDailyUsageUsd = nonNegative(input.dailyUsageUsd);
  const growthRate = nonNegative(input.dailyGrowthPercent) / 100;
  const warningThresholdDays = Math.floor(
    nonNegative(input.warningThresholdDays),
  );

  if (balanceUsd === 0) {
    return {
      daysRemaining: 0,
      endingDailyUsageUsd: startingDailyUsageUsd,
      status: "critical" as const,
    };
  }

  if (startingDailyUsageUsd === 0) {
    return {
      daysRemaining: null,
      endingDailyUsageUsd: 0,
      status: "safe" as const,
    };
  }

  let remainingUsd = balanceUsd;
  let dailyUsageUsd = startingDailyUsageUsd;
  let daysRemaining = 0;

  while (remainingUsd > 0 && daysRemaining < 3650) {
    remainingUsd -= dailyUsageUsd;
    daysRemaining += 1;
    dailyUsageUsd *= 1 + growthRate;
  }

  const criticalThreshold = Math.max(7, Math.floor(warningThresholdDays / 2));

  return {
    daysRemaining,
    endingDailyUsageUsd: dailyUsageUsd,
    status:
      daysRemaining <= criticalThreshold
        ? ("critical" as const)
        : daysRemaining <= warningThresholdDays
          ? ("warning" as const)
          : ("safe" as const),
  };
}
