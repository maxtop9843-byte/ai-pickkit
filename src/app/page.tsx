import Link from "next/link";

const checks = ["GitHub CI", "Vercel Preview", "자동 병합", "Production smoke"];

export default function Home() {
  return (
    <main data-smoke="home">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AI PickKit 홈">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          AI PickKit
        </Link>
        <span className="phase">Foundation preview</span>
      </header>
      <section className="hero">
        <p className="eyebrow">AI 선택을 쉽게</p>
        <h1>더 나은 AI를 고르는 가장 쉬운 도구</h1>
        <p className="lede">
          AI 모델의 가격을 계산하고, 기능을 비교하고, 내 목적에 맞는 선택을 찾는
          초보자 친화적인 도구 모음입니다.
        </p>
        <div className="actions">
          <span className="primary-action">첫 계산기 준비 중</span>
          <a href="#automation">자동화 상태 보기</a>
        </div>
      </section>
      <section
        className="status-card"
        id="automation"
        aria-labelledby="status-title"
      >
        <div>
          <p className="eyebrow">APK-001</p>
          <h2 id="status-title">배포 자동화 시험 페이지</h2>
          <p>
            이 작은 페이지가 Preview, 자동 병합, production 배포와 smoke test를
            실제로 통과한 뒤에만 다음 제품 기능을 시작합니다.
          </p>
        </div>
        <ul>
          {checks.map((check) => (
            <li key={check}>
              <span aria-hidden="true">✓</span>
              {check}
            </li>
          ))}
        </ul>
      </section>
      <footer>© 2026 AI PickKit · aipickkit.com</footer>
    </main>
  );
}
