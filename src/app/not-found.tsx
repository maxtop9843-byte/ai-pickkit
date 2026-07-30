import Link from "next/link";
import styles from "./recovery.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <section aria-labelledby="not-found-title" className={styles.panel}>
        <p className="section-kicker">404 · ROUTE RECOVERY</p>
        <h1 id="not-found-title" className={styles.title}>
          요청한 페이지를 찾지 못했습니다.
        </h1>
        <p className={`lede ${styles.copy}`}>
          주소가 바뀌었거나 링크가 오래되었을 수 있습니다. 입력한 주소를 다시
          확인하거나 전체 도구 목록에서 필요한 계산기를 찾아보세요.
        </p>
        <nav aria-label="404 복구 경로" className={styles.actions}>
          <Link className={`hero-link ${styles.primaryAction}`} href="/">
            홈으로 돌아가기 <span aria-hidden="true">→</span>
          </Link>
          <Link className={styles.secondaryAction} href="/#tools">
            전체 도구 보기
          </Link>
        </nav>
      </section>
    </main>
  );
}
