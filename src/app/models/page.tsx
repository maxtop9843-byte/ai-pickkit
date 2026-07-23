import type { Metadata } from "next";
import Link from "next/link";
import ModelComparison from "@/components/model-comparison";
import ToolPage from "@/components/tool-page";
import { catalogModels } from "@/lib/model-catalog";
import { providerSlugs } from "@/lib/model-guides";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("models");

export const metadata: Metadata = {
  title: `${route.title} | AI PickKit`,
  description: route.description,
  alternates: { canonical: route.href },
  openGraph: {
    title: route.title,
    description: route.description,
    url: route.href,
  },
};

export default function ModelsPage() {
  return (
    <ToolPage route={route} smoke="models-page">
      <ModelComparison />
      <section className="explain-section" aria-labelledby="guide-index-title">
        <p className="section-kicker">PRICE GUIDE INDEX</p>
        <h2 id="guide-index-title">공급자와 모델별 가격 가이드</h2>
        <div className="prompt-tool-actions">
          {Object.entries(providerSlugs).map(([provider, slug]) => (
            <Link href={`/providers/${slug}`} key={provider}>
              {provider} 가격 가이드 →
            </Link>
          ))}
        </div>
        <div className="explain-grid">
          {catalogModels.map((model) => (
            <article key={model.id}>
              <span>{model.provider.slice(0, 1)}</span>
              <h3><Link href={`/models/${model.id}`}>{model.name}</Link></h3>
              <p>{model.tierLabel} · {model.bestFor}</p>
            </article>
          ))}
        </div>
      </section>
    </ToolPage>
  );
}
