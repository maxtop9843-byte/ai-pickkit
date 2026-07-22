import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import type { ToolRoute } from "@/lib/tool-routes";

export default function ToolPage({
  route,
  smoke,
  children,
}: {
  route: ToolRoute;
  smoke: string;
  children: ReactNode;
}) {
  return (
    <main className="tool-page" data-smoke={smoke}>
      <SiteHeader />
      <section className="tool-page-intro" aria-labelledby="tool-page-title">
        <div>
          <Link href="/">AI PickKit</Link>
          <span aria-hidden="true">/</span>
          <span>{route.navLabel}</span>
        </div>
        <p className="section-kicker">{route.eyebrow}</p>
        <h1 id="tool-page-title">{route.title}</h1>
        <p>{route.description}</p>
      </section>
      {children}
      <SiteFooter />
    </main>
  );
}
