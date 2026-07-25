import Link from "next/link";
import { toolRoutes } from "@/lib/tool-routes";

const primaryToolIds = new Set([
  "calculator",
  "savings",
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
        <Link href="/">모든 도구</Link>
      </nav>
      <Link className="header-cta" href="/api-cost-calculator">
        바로 계산하기
      </Link>
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
      <span>© 2026 AI PickKit · aipickkit.com</span>
    </footer>
  );
}
