import type { CatalogModel } from "./model-catalog";

export type TokenEstimate = {
  characters: number;
  words: number;
  lines: number;
  cjkCharacters: number;
  lower: number;
  upper: number;
};

const cjkPattern =
  /[\u1100-\u11ff\u3130-\u318f\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/u;

export function estimatePromptTokens(text: string): TokenEstimate {
  const characters = Array.from(text).length;
  const visibleCharacters = Array.from(text).filter(
    (character) => !/\s/u.test(character),
  );
  const cjkCharacters = visibleCharacters.filter((character) =>
    cjkPattern.test(character),
  ).length;
  const otherCharacters = visibleCharacters.length - cjkCharacters;
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const lines = text ? text.split(/\r?\n/u).length : 0;

  if (visibleCharacters.length === 0) {
    return { characters, words, lines, cjkCharacters, lower: 0, upper: 0 };
  }

  const lower = Math.max(
    1,
    Math.ceil(cjkCharacters * 0.65 + otherCharacters / 5),
  );
  const upper = Math.max(
    lower,
    Math.ceil(cjkCharacters * 1.6 + otherCharacters / 2.5),
  );

  return { characters, words, lines, cjkCharacters, lower, upper };
}

export function estimatePromptCost({
  estimate,
  outputTokens,
  requestsPerDay,
  model,
}: {
  estimate: Pick<TokenEstimate, "lower" | "upper">;
  outputTokens: number;
  requestsPerDay: number;
  model: CatalogModel;
}) {
  const outputCost = (outputTokens * model.outputPerMillion) / 1_000_000;
  const requestLower =
    (estimate.lower * model.inputPerMillion) / 1_000_000 + outputCost;
  const requestUpper =
    (estimate.upper * model.inputPerMillion) / 1_000_000 + outputCost;
  const monthlyRequests = requestsPerDay * 30;

  return {
    requestLower,
    requestUpper,
    monthlyLower: requestLower * monthlyRequests,
    monthlyUpper: requestUpper * monthlyRequests,
    monthlyRequests,
  };
}
