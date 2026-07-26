import CostCalculator from "@/components/cost-calculator";
import ModelComparison from "@/components/model-comparison";
import ModelSelector from "@/components/model-selector";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { toolRoutes } from "@/lib/tool-routes";
import Link from "next/link";
import "./home-discovery.css";

const featuredToolIds = new Set([
  "calculator",
  "prompt",
  "directComparison",
  "selector",
  "budgetCapacity",
  "images",
  "rag",
]);

const featuredTools = toolRoutes.filter((tool) =>
  featuredToolIds.has(tool.id),
);

export default function Home() {
  return (
    <main data-smoke="home">
      <SiteHeader />

      <section className="hero home-hero" aria-labelledby="home-hero-title">
        <p className="eyebrow">
          <span /> AI 비용·모델 의사결정 도구
        </p>
        <h1 id="home-hero-title">
          AI 비용부터 모델 선택까지,
          <br />
          <em>필요한 판단을 한곳에서.</em>
        </h1>
        <p className="lede">
          프롬프트 토큰과 API·이미지·음성·RAG 비용을 계산하고, 모델을 직접
          비교하고, 월 예산에 맞는 선택을 찾으세요. 공식 가격 출처와 검증일도 함께
          제공합니다.
        </p>
        <div className="home-hero-actions" aria-label="주요 시작 경로">
          <Link className="hero-link" href="/prompt-token-calculator">
            프롬프트 사용량 확인 <span aria-hidden="true">→</span>
          </Link>
          <Link className="home-secondary-link" href="/tools">
            모든 도구 보기
          </Link>
        </div>
        <div className="trust-line">
          <span>로그인 없음</span>
          <span>입력값 서버 저장 안 함</span>
          <span>공식 가격 출처 공개</span>
        </div>
      </section>

      <section
        className="home-tool-directory"
        id="all-tools"
        aria-labelledby="home-tools-title"
      >
        <div className="home-tool-directory-heading">
          <div>
            <p className="section-kicker">START WITH A DECISION</p>
            <h2 id="home-tools-title">지금 필요한 작업부터 고르세요</h2>
          </div>
          <p>
            프롬프트 사용량, 계산, 비교, 추천, 예산 계획까지 자주 찾는 도구를 바로
            열 수 있습니다. 전체 목록에서는 {toolRoutes.length}개 도구를 목적별로
            확인할 수 있습니다.
          </p>
        </div>
        <div className="home-tool-grid">
          {featuredTools.map((tool, index) => (
            <Link href={tool.href} key={tool.id} className="home-tool-link">
              <span className="home-tool-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="home-tool-copy">
                <strong>{tool.navLabel}</strong>
                <small>{tool.description}</small>
              </span>
              <span className="home-tool-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
        <div className="home-tool-directory-footer">
          <p>Pickkit에는 현재 {toolRoutes.length}개의 독립 도구가 있습니다.</p>
          <Link href="/tools">전체 도구를 목적별로 보기 →</Link>
        </div>
      </section>

      <CostCalculator />

      <ModelComparison />

      <ModelSelector />

      <section
        className="prompt-tool-band"
        aria-labelledby="prompt-tool-band-title"
      >
        <div>
          <p className="section-kicker">PROMPT USAGE · TOKEN · COST</p>
          <h2 id="prompt-tool-band-title">
            입력한 프롬프트가 모델별 사용량을 얼마나 쓰는지 확인하세요
          </h2>
        </div>
        <p>
          텍스트를 붙여넣으면 언어 구성을 반영한 토큰 범위와 모델별 요청·월간
          비용을 보여드립니다. 입력 내용은 브라우저 밖으로 보내지 않습니다.
        </p>
        <div className="prompt-tool-actions">
          <Link href="/prompt-token-calculator">프롬프트 사용량 분석 →</Link>
          <Link href="/batch-cache-simulator">Batch·캐싱 절감 비교 →</Link>
        </div>
      </section>

      <section className="explain-section" aria-labelledby="explain-title">
        <p className="section-kicker">HOW THE NUMBER WORKS</p>
        <h2 id="explain-title">계산 결과, 이렇게 읽으세요</h2>
        <div className="explain-grid">
          <article>
            <span>1</span>
            <h3>입력과 출력은 가격이 달라요</h3>
            <p>
              사용자가 보내는 질문·문서가 입력이고, AI가 생성하는 답변이
              출력입니다. 일반적으로 출력 단가가 더 높습니다.
            </p>
          </article>
          <article>
            <span>2</span>
            <h3>월 비용은 30일 기준이에요</h3>
            <p>
              하루 사용자 × 사용자당 질문 수 × 30일에 모델별 토큰 단가를
              적용합니다.
            </p>
          </article>
          <article>
            <span>3</span>
            <h3>실제 비용은 범위로 보세요</h3>
            <p>
              대화 길이와 답변 길이는 매번 달라집니다. 계산값에 20~30% 여유를 둔
              예산을 권합니다.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
