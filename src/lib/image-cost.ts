export type ImagePriceOption = {
  id: string;
  provider: "OpenAI" | "Google";
  model: string;
  label: string;
  resolution: string;
  pricePerImageUsd: number;
  note: string;
  sourceUrl: string;
  verifiedAt: string;
};

export const imagePriceOptions: ImagePriceOption[] = [
  {
    id: "gpt-image-1-low-square",
    provider: "OpenAI",
    model: "gpt-image-1",
    label: "Low",
    resolution: "정사각형",
    pricePerImageUsd: 0.02,
    note: "빠른 시안과 대량 생성에 적합한 공식 근사 단가입니다.",
    sourceUrl: "https://openai.com/index/image-generation-api/",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gpt-image-1-medium-square",
    provider: "OpenAI",
    model: "gpt-image-1",
    label: "Medium",
    resolution: "정사각형",
    pricePerImageUsd: 0.07,
    note: "일반적인 제품 이미지와 콘텐츠 제작용 공식 근사 단가입니다.",
    sourceUrl: "https://openai.com/index/image-generation-api/",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gpt-image-1-high-square",
    provider: "OpenAI",
    model: "gpt-image-1",
    label: "High",
    resolution: "정사각형",
    pricePerImageUsd: 0.19,
    note: "고품질 결과용 공식 근사 단가입니다.",
    sourceUrl: "https://openai.com/index/image-generation-api/",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gemini-3-1-flash-image-1k",
    provider: "Google",
    model: "Gemini 3.1 Flash Image",
    label: "1K",
    resolution: "1024px",
    pricePerImageUsd: 0.067,
    note: "표준 처리 기준 이미지 출력 단가입니다.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gemini-3-1-flash-image-2k",
    provider: "Google",
    model: "Gemini 3.1 Flash Image",
    label: "2K",
    resolution: "2048px",
    pricePerImageUsd: 0.101,
    note: "표준 처리 기준 이미지 출력 단가입니다.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gemini-3-1-flash-image-4k",
    provider: "Google",
    model: "Gemini 3.1 Flash Image",
    label: "4K",
    resolution: "4096px",
    pricePerImageUsd: 0.151,
    note: "표준 처리 기준 이미지 출력 단가입니다.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gemini-3-pro-image-2k",
    provider: "Google",
    model: "Gemini 3 Pro Image",
    label: "1K·2K",
    resolution: "최대 2048px",
    pricePerImageUsd: 0.134,
    note: "복잡한 지시와 전문 자산 제작용 표준 처리 단가입니다.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-23",
  },
  {
    id: "gemini-3-pro-image-4k",
    provider: "Google",
    model: "Gemini 3 Pro Image",
    label: "4K",
    resolution: "4096px",
    pricePerImageUsd: 0.24,
    note: "전문 자산 제작용 4K 표준 처리 단가입니다.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    verifiedAt: "2026-07-23",
  },
];

export function calculateImageCost(
  pricePerImageUsd: number,
  imagesPerDay: number,
  daysPerMonth: number,
) {
  const dailyUsd = pricePerImageUsd * imagesPerDay;
  return {
    dailyUsd,
    monthlyUsd: dailyUsd * daysPerMonth,
    imagesPerMonth: imagesPerDay * daysPerMonth,
  };
}
