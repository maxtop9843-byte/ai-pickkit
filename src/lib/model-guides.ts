import { catalogModels, providerSources, type Provider } from "./model-catalog";

export const providerSlugs: Record<Provider, string> = {
  OpenAI: "openai",
  Anthropic: "anthropic",
  Google: "google",
};

export const providerBySlug = Object.fromEntries(
  Object.entries(providerSlugs).map(([provider, slug]) => [slug, provider]),
) as Record<string, Provider>;

export const providerGuideCopy: Record<
  Provider,
  { summary: string; strengths: string[]; caveats: string[] }
> = {
  OpenAI: {
    summary:
      "범용 에이전트와 제품 기능을 폭넓게 구성할 때 비교하기 좋은 공급자입니다.",
    strengths: ["경제형부터 최상위 모델까지 단계가 명확함", "Batch와 캐시 가격 비교 가능", "멀티모달 제품 흐름에 적용 가능"],
    caveats: ["도구 호출·검색·이미지 비용은 별도일 수 있음", "실제 프롬프트 평가 없이 모델명을 품질 보증으로 해석하지 않기"],
  },
  Anthropic: {
    summary:
      "코딩, 문서 작업과 장시간 에이전트 흐름을 가격 단계별로 비교하기 좋은 공급자입니다.",
    strengths: ["대량 처리용 Haiku와 범용 Sonnet 구분", "프롬프트 캐시와 Batch 절감 시나리오 제공", "복잡한 작업용 상위 모델 비교 가능"],
    caveats: ["프로모션 가격의 종료일 확인 필요", "긴 컨텍스트와 부가 기능 과금은 공식 문서 재확인 필요"],
  },
  Google: {
    summary:
      "고용량 처리와 멀티모달 기능을 낮은 시작 단가부터 비교하기 좋은 공급자입니다.",
    strengths: ["Flash 계열의 낮은 처리 단가", "멀티모달과 Batch 지원", "경제형·균형형·상위 모델 선택 폭"],
    caveats: ["입력 길이에 따라 단가 구간이 달라질 수 있음", "Preview 모델은 사양과 가격이 바뀔 수 있음"],
  },
};

export function modelsForProvider(provider: Provider) {
  return catalogModels.filter((model) => model.provider === provider);
}

export function providerGuide(provider: Provider) {
  return {
    provider,
    source: providerSources[provider],
    copy: providerGuideCopy[provider],
    models: modelsForProvider(provider),
  };
}
