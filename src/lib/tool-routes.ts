export type ToolRoute = {
  id: "calculator" | "prompt" | "models" | "selector";
  href:
    | "/api-cost-calculator"
    | "/prompt-token-calculator"
    | "/models"
    | "/model-selector";
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
];

export function getToolRoute(id: ToolRoute["id"]) {
  const route = toolRoutes.find((item) => item.id === id);
  if (!route) throw new Error(`Unknown tool route: ${id}`);
  return route;
}
