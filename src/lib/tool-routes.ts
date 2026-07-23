export type ToolRoute = {
  id:
    | "calculator"
    | "prompt"
    | "savings"
    | "models"
    | "selector"
    | "images"
    | "audio"
    | "rag"
    | "fineTuning";
  href:
    | "/api-cost-calculator"
    | "/prompt-token-calculator"
    | "/batch-cache-simulator"
    | "/models"
    | "/model-selector"
    | "/image-generation-cost-calculator"
    | "/audio-cost-calculator"
    | "/rag-cost-calculator"
    | "/fine-tuning-cost-calculator";
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const toolRoutes: ToolRoute[] = [
  {
    id: "calculator",
    href: "/api-cost-calculator",
    navLabel: "비용 계산기",
    eyebrow: "API COST ESTIMATOR",
    title: "AI API 비용 계산기",
    description:
      "토큰을 몰라도 사용자 수와 질문 횟수만으로 모델별 요청·하루·월간 API 비용을 계산하세요.",
  },
  {
    id: "prompt",
    href: "/prompt-token-calculator",
    navLabel: "프롬프트 비용",
    eyebrow: "PROMPT METER",
    title: "프롬프트 토큰·비용 추정기",
    description:
      "텍스트를 붙여넣고 예상 토큰 범위와 선택한 AI 모델별 요청 1회·월간 API 비용을 비교하세요.",
  },
  {
    id: "savings",
    href: "/batch-cache-simulator",
    navLabel: "비용 절감",
    eyebrow: "EFFICIENCY LEDGER",
    title: "Batch·캐싱 절감 시뮬레이터",
    description:
      "반복 입력·캐시 적중·비실시간 요청 비중을 조정하고 기본 비용과 Batch·캐싱 최적화 시나리오를 비교하세요.",
  },
  {
    id: "models",
    href: "/models",
    navLabel: "모델 비교",
    eyebrow: "MODEL INDEX",
    title: "AI 모델 가격·특성 비교",
    description:
      "OpenAI·Anthropic·Google 대표 모델의 공식 입력·출력 가격과 추천 용도를 한 화면에서 비교하세요.",
  },
  {
    id: "selector",
    href: "/model-selector",
    navLabel: "모델 추천",
    eyebrow: "MODEL PATHFINDER",
    title: "목적 기반 AI 모델 선택 도우미",
    description:
      "용도·예산·공급자·Preview 허용 여부를 선택하고 먼저 시험할 AI 모델과 대안 후보를 확인하세요.",
  },
  {
    id: "images",
    href: "/image-generation-cost-calculator",
    navLabel: "이미지 비용",
    eyebrow: "IMAGE COST WORKBENCH",
    title: "이미지 생성 비용 계산기",
    description:
      "공식 가격을 바탕으로 모델·품질·해상도와 하루 생성량에 따른 이미지 1장·하루·월간 예상 비용을 계산하세요.",
  },
  {
    id: "audio",
    href: "/audio-cost-calculator",
    navLabel: "음성 비용",
    eyebrow: "VOICE COST WORKBENCH",
    title: "음성 인식·TTS 비용 계산기",
    description:
      "공식 가격을 바탕으로 음성 인식 분량과 TTS 문자 수에 따른 하루·월간 예상 비용을 비교하세요.",
  },
  {
    id: "rag",
    href: "/rag-cost-calculator",
    navLabel: "RAG 비용",
    eyebrow: "RAG COST WORKBENCH",
    title: "임베딩·RAG 비용 계산기",
    description:
      "문서량·청크 크기·중첩률·질의량·재색인 주기를 입력하고 월간 임베딩 비용과 예상 청크 수를 계산하세요.",
  },
  {
    id: "fineTuning",
    href: "/fine-tuning-cost-calculator",
    navLabel: "파인튜닝 비용",
    eyebrow: "FINE-TUNING COST WORKBENCH",
    title: "파인튜닝 비용 계산기",
    description:
      "학습 데이터·에폭·월간 요청량을 입력하고 일회성 모델 학습비와 월간 추론 비용을 함께 계산하세요.",
  },
];

export function getToolRoute(id: ToolRoute["id"]) {
  const route = toolRoutes.find((item) => item.id === id);
  if (!route) throw new Error(`Unknown tool route: ${id}`);
  return route;
}
