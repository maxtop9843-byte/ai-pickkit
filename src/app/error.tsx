"use client";

import Link from "next/link";
import styles from "./recovery.module.css";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className={styles.main}>
      <section aria-labelledby="route-error-title" className={styles.panel}>
        <p className="section-kicker">RECOVERY MODE</p>
        <h1 id="route-error-title" className={styles.title}>
          페이지를 불러오는 중 문제가 생겼습니다.
        </h1>
        <p className={`lede ${styles.copy}`}>
          입력값은 가능한 한 브라우저에 그대로 남아 있습니다. 먼저 다시 시도하고,
          문제가 계속되면 홈에서 도구를 다시 열어주세요.
        </p>
        <div className={styles.actions}>
          <button
            className={`hero-link ${styles.primaryAction}`}
            type="button"
            onClick={reset}
          >
            다시 시도 <span aria-hidden="true">↻</span>
          </button>
          <Link className={styles.secondaryAction} href="/">
            홈으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
