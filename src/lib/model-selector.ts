import {
  blendedPrice,
  catalogModels,
  type CatalogModel,
  type ModelTier,
  type Provider,
} from "./model-catalog";

export type ModelPurpose =
  "support" | "writing" | "documents" | "coding" | "agents";
export type ModelPriority = "budget" | "balance" | "quality";
export type ProviderPreference = Provider | "any";

export type SelectorAnswers = {
  purpose: ModelPurpose;
  priority: ModelPriority;
  provider: ProviderPreference;
  allowPreview: boolean;
};

export type ModelRecommendation = {
  model: CatalogModel;
  score: number;
  reasons: string[];
  tradeoff: string;
};

export const purposeOptions: Array<{
  id: ModelPurpose;
  label: string;
  description: string;
}> = [
  {
    id: "support",
    label: "고객 응대",
    description: "반복 문의·분류·짧은 답변",
  },
  { id: "writing", label: "글쓰기", description: "초안·요약·콘텐츠 제작" },
  {
    id: "documents",
    label: "문서 분석",
    description: "긴 자료를 읽고 핵심 추출",
  },
  { id: "coding", label: "코딩", description: "코드 작성·리뷰·개발 보조" },
  {
    id: "agents",
    label: "업무 자동화",
    description: "도구를 쓰는 여러 단계 작업",
  },
];

export const priorityOptions: Array<{
  id: ModelPriority;
  label: string;
  description: string;
}> = [
  {
    id: "budget",
    label: "비용 절감",
    description: "대량 호출 비용을 먼저 봐요",
  },
  {
    id: "balance",
    label: "균형",
    description: "비용과 작업 난이도를 함께 봐요",
  },
  {
    id: "quality",
    label: "복잡한 작업",
    description: "높은 난이도 대응을 우선해요",
  },
];

const purposeScores: Record<ModelPurpose, Partial<Record<string, number>>> = {
  support: {
    "gemini-3-5-flash-lite": 7,
    "claude-haiku-4-5": 7,
    "gpt-5-6-luna": 6,
  },
  writing: {
    "claude-sonnet-5": 7,
    "gpt-5-6-terra": 6,
    "gemini-3-1-flash": 5,
    "claude-opus-4-8": 4,
  },
  documents: {
    "gemini-3-1-pro-preview": 7,
    "claude-sonnet-5": 6,
    "claude-opus-4-8": 6,
    "gpt-5-6-terra": 5,
  },
  coding: {
    "claude-sonnet-5": 8,
    "gemini-3-1-pro-preview": 7,
    "gpt-5-6-terra": 6,
    "gpt-5-6-sol": 5,
    "claude-opus-4-8": 5,
  },
  agents: {
    "gpt-5-6-terra": 7,
    "claude-sonnet-5": 7,
    "gemini-3-1-pro-preview": 7,
    "gpt-5-6-sol": 5,
    "claude-opus-4-8": 5,
  },
};

const priorityScores: Record<ModelPriority, Record<ModelTier, number>> = {
  budget: { economy: 7, balanced: 3, frontier: 0 },
  balance: { economy: 3, balanced: 7, frontier: 3 },
  quality: { economy: 0, balanced: 4, frontier: 7 },
};

const tierTradeoffs: Record<ModelTier, string> = {
  economy: "복잡한 추론이 자주 필요하면 균형형 모델도 함께 시험해 보세요.",
  balanced: "호출량이 커지면 같은 작업을 경제형 모델로도 비교해 보세요.",
  frontier:
    "난이도가 낮은 요청까지 모두 처리하면 비용이 빠르게 커질 수 있어요.",
};

const purposeLabels: Record<ModelPurpose, string> = {
  support: "고객 응대",
  writing: "글쓰기",
  documents: "문서 분석",
  coding: "코딩",
  agents: "업무 자동화",
};

const priorityLabels: Record<ModelPriority, string> = {
  budget: "비용 절감",
  balance: "비용·난이도 균형",
  quality: "복잡한 작업 대응",
};

export function recommendModels(
  answers: SelectorAnswers,
): ModelRecommendation[] {
  return catalogModels
    .filter((model) => answers.allowPreview || model.status !== "Preview")
    .map((model) => {
      const purposeScore = purposeScores[answers.purpose][model.id] ?? 2;
      const providerScore =
        answers.provider === "any"
          ? 0
          : model.provider === answers.provider
            ? 4
            : -2;
      const reasons = [
        `${purposeLabels[answers.purpose]} 용도 적합도 반영`,
        `${priorityLabels[answers.priority]}에 맞는 ${model.tierLabel}`,
      ];
      if (answers.provider !== "any" && model.provider === answers.provider) {
        reasons.push(`${model.provider} 선호 반영`);
      }

      return {
        model,
        score:
          purposeScore +
          priorityScores[answers.priority][model.tier] +
          providerScore,
        reasons,
        tradeoff: tierTradeoffs[model.tier],
      };
    })
    .toSorted(
      (a, b) =>
        b.score - a.score || blendedPrice(a.model) - blendedPrice(b.model),
    )
    .slice(0, 3);
}
