import Link from "next/link";
import CostCalculator from "@/components/cost-calculator";
import ModelComparison from "@/components/model-comparison";

export default function Home() {
  return (
    <main data-smoke="home">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AI PickKit 홈">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>AI PickKit</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <a href="#calculator">비용 계산기</a>
          <a href="#models">모델 비교</a>
        </nav>
        <a className="header-cta" href="#calculator">
          바로 계산하기
        </a>
      </header>

      <section className="hero">
        <p className="eyebrow">
          <span /> AI 선택을 쉽게
        </p>
        <h1>
          내 AI 서비스,
          <br />
          <em>한 달에 얼마일까?</em>
        </h1>
        <p className="lede">
          어려운 토큰 계산 대신 사용자를 알려주세요. 실제 API 가격을 바탕으로
          운영비와 절감 방법을 한눈에 보여드립니다.
        </p>
        <a className="hero-link" href="#calculator">
          비용 계산 시작 <span aria-hidden="true">↓</span>
        </a>
        <div className="trust-line">
          <span>로그인 없음</span>
          <span>입력값 저장 안 함</span>
          <span>공식 가격 출처 공개</span>
        </div>
      </section>

      <CostCalculator />

      <ModelComparison />

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

      <footer>
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">P</span>AI PickKit
        </Link>
        <p>비교하고, 계산하고, 나에게 맞는 AI를 고르세요.</p>
        <span>© 2026 AI PickKit · aipickkit.com</span>
      </footer>
    </main>
  );
}
