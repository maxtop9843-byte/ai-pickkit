export type FreeCreditRunwayInput = {
  balanceUsd: number;
  dailyUsageUsd: number;
  dailyGrowthPercent: number;
  warningThresholdDays: number;
};

export function normalizeFreeCreditRunwayInput(
  key: keyof FreeCreditRunwayInput,
  value: number,
): number {
  const finiteValue = Number.isFinite(value) ? value : 0;

  if (key === "warningThresholdDays") {
    return Math.max(1, Math.floor(finiteValue));
  }

  return Math.max(0, finiteValue);
}

export function calculateFreeCreditRunway(input: FreeCreditRunwayInput) {
  const balanceUsd = normalizeFreeCreditRunwayInput(
    "balanceUsd",
    input.balanceUsd,
  );
  const startingDailyUsageUsd = normalizeFreeCreditRunwayInput(
    "dailyUsageUsd",
    input.dailyUsageUsd,
  );
  const growthRate =
    normalizeFreeCreditRunwayInput(
      "dailyGrowthPercent",
      input.dailyGrowthPercent,
    ) / 100;
  const warningThresholdDays = normalizeFreeCreditRunwayInput(
    "warningThresholdDays",
    input.warningThresholdDays,
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
