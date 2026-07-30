import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-[min(760px,calc(100%-40px))] items-center py-20">
      <section
        aria-labelledby="not-found-title"
        className="w-full border-y border-[var(--border)] py-14"
      >
        <p className="section-kicker">404 · ROUTE RECOVERY</p>
        <h1
          id="not-found-title"
          className="max-w-3xl text-[clamp(42px,8vw,72px)]"
        >
          요청한 페이지를 찾지 못했습니다.
        </h1>
        <p className="lede mx-0 max-w-2xl">
          주소가 바뀌었거나 링크가 오래되었을 수 있습니다. 입력한 주소를 다시
          확인하거나 전체 도구 목록에서 필요한 계산기를 찾아보세요.
        </p>
        <nav
          aria-label="404 복구 경로"
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link className="hero-link mt-0" href="/">
            홈으로 돌아가기 <span aria-hidden="true">→</span>
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-[9px] border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold no-underline"
            href="/#tools"
          >
            전체 도구 보기
          </Link>
        </nav>
      </section>
    </main>
  );
}
