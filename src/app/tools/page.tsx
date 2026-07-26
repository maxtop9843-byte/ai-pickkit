import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { toolRoutes, type ToolRoute } from "@/lib/tool-routes";
import "./tools.css";

export const metadata: Metadata = {
  title: "AI 비용·모델 도구 전체 목록 | AI PickKit",
  description:
    "프롬프트 토큰, API·이미지·음성·RAG 비용, 모델 비교와 추천, 예산 계획까지 Pickkit의 모든 도구를 목적별로 찾으세요.",
  alternates: { canonical: "/tools" },
};

type ToolGroup = {
  title: string;
  description: string;
  ids: ToolRoute["id"][];
};

const toolGroups: ToolGroup[] = [
  {
    title: "프롬프트와 API 사용량",
    description: "내 입력이 토큰과 비용을 얼마나 사용하는지 계산합니다.",
    ids: ["prompt", "calculator", "savings"],
  },
  {
    title: "모델 비교와 선택",
    description: "가격, 기능, 목적과 예산을 기준으로 모델을 고릅니다.",
    ids: ["models", "directComparison", "selector", "providerBudget"],
  },
  {
    title: "서비스 유형별 비용",
    description: "이미지, 음성, RAG, 파인튜닝과 에이전트 비용을 계산합니다.",
    ids: ["images", "audio", "rag", "fineTuning", "agentTools"],
  },
  {
    title: "예산과 서비스 원가",
    description: "크레딧 소진, 처리 가능량과 복합 서비스 원가를 계획합니다.",
    ids: ["freeCredit", "budgetCapacity", "compositeService"],
  },
];

const toolsById = new Map(toolRoutes.map((tool) => [tool.id, tool]));

export default function ToolsPage() {
  return (
    <main data-smoke="tools-directory">
      <SiteHeader />
      <section className="tools-directory-hero" aria-labelledby="tools-title">
        <p className="eyebrow">
          <span /> ALL PICKKIT TOOLS
        </p>
        <h1 id="tools-title">필요한 AI 비용·모델 도구를 한곳에서 찾으세요</h1>
        <p>
          Pickkit에는 현재 {toolRoutes.length}개의 독립 도구가 있습니다. 하고 싶은
          작업을 기준으로 골라 바로 시작하세요.
        </p>
      </section>

      <nav className="tools-quick-nav" aria-label="도구 분류 바로가기">
        {toolGroups.map((group, index) => (
          <a href={`#tool-group-${index + 1}`} key={group.title}>
            {group.title}
          </a>
        ))}
      </nav>

      <section className="tools-directory" aria-label="Pickkit 전체 도구">
        {toolGroups.map((group, groupIndex) => (
          <section
            className="tool-group"
            id={`tool-group-${groupIndex + 1}`}
            aria-labelledby={`tool-group-title-${groupIndex + 1}`}
            key={group.title}
          >
            <header>
              <p>{String(groupIndex + 1).padStart(2, "0")}</p>
              <div>
                <h2 id={`tool-group-title-${groupIndex + 1}`}>{group.title}</h2>
                <span>{group.description}</span>
              </div>
            </header>
            <div className="tool-group-list">
              {group.ids.map((id) => {
                const tool = toolsById.get(id);
                if (!tool) return null;
                return (
                  <Link href={tool.href} key={tool.id} className="tool-directory-link">
                    <span>
                      <strong>{tool.navLabel}</strong>
                      <small>{tool.description}</small>
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
