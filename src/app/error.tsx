"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pickkit route error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-[min(760px,calc(100%-40px))] items-center py-20">
      <section
        aria-labelledby="route-error-title"
        className="w-full border-y border-[var(--border)] py-14"
      >
        <p className="section-kicker">RECOVERY MODE</p>
        <h1
          id="route-error-title"
          className="max-w-3xl text-[clamp(42px,8vw,72px)]"
        >
          페이지를 불러오는 중 문제가 생겼습니다.
        </h1>
        <p className="lede mx-0 max-w-2xl">
          입력값은 가능한 한 브라우저에 그대로 남아 있습니다. 먼저 다시 시도하고,
          문제가 계속되면 홈에서 도구를 다시 열어주세요.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="hero-link mt-0 border-0"
            type="button"
            onClick={reset}
          >
            다시 시도 <span aria-hidden="true">↻</span>
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-[9px] border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold no-underline"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-6 text-xs text-[var(--muted)]">
            오류 참조: <code>{error.digest}</code>
          </p>
        ) : null}
      </section>
    </main>
  );
}
