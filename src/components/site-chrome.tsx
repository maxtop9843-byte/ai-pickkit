import Link from "next/link";
import { toolRoutes } from "@/lib/tool-routes";
import ThemeToggle from "@/components/theme-toggle";

const primaryToolIds = new Set([
  "calculator",
  "prompt",
  "models",
  "selector",
  "directComparison",
]);

const primaryToolRoutes = toolRoutes.filter((route) =>
  primaryToolIds.has(route.id),
);

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="AI PickKit 홈">
        <span className="brand-mark" aria-hidden="true">
          P
        </span>
        <span>AI PickKit</span>
      </Link>
      <nav aria-label="주요 메뉴">
        {primaryToolRoutes.map((route) => (
          <Link href={route.href} key={route.id}>
            {route.navLabel}
          </Link>
        ))}
        <Link href="/tools">모든 도구</Link>
      </nav>
      <div className="site-header-actions">
        <ThemeToggle />
        <Link className="header-cta" href="/tools">
          도구 찾기
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <Link className="brand footer-brand" href="/">
        <span className="brand-mark">P</span>AI PickKit
      </Link>
      <p>비교하고, 계산하고, 나에게 맞는 AI를 고르세요.</p>
      <Link href="/tools">전체 도구 {toolRoutes.length}개 보기</Link>
      <span>© 2026 AI PickKit · aipickkit.com</span>
    </footer>
  );
}
