import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  catalogModels,
  CATALOG_VERIFIED_AT,
  getCatalogModel,
} from "@/lib/model-catalog";
import { providerSlugs } from "@/lib/model-guides";

export function generateStaticParams() {
  return catalogModels.map((model) => ({ id: model.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = catalogModels.find((entry) => entry.id === id);
  if (!model) return {};
  const title = `${model.name} API 가격·추천 용도 | AI PickKit`;
  const description = `${model.name}의 입력·출력·캐시 가격, 추천 용도, Batch와 멀티모달 지원 여부를 공식 출처 기준으로 확인하세요.`;
  const canonical = `/models/${model.id}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

const usd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!catalogModels.some((entry) => entry.id === id)) notFound();
  const model = getCatalogModel(id);
  const alternatives = catalogModels
    .filter((entry) => entry.tier === model.tier && entry.id !== model.id)
    .slice(0, 2);

  return (
    <main className="tool-page" data-smoke="model-detail-page">
      <SiteHeader />
      <section className="tool-page-intro" aria-labelledby="model-guide-title">
        <div>
          <Link href="/">AI PickKit</Link>
          <span aria-hidden="true">/</span>
          <Link href="/models">모델 비교</Link>
          <span aria-hidden="true">/</span>
          <span>{model.name}</span>
        </div>
        <p className="section-kicker">
          MODEL GUIDE · {model.provider.toUpperCase()}
        </p>
        <h1 id="model-guide-title">{model.name}</h1>
        <p>
          {model.bestFor}. 가격과 지원 기능을 확인한 뒤 실제 프롬프트 평가
          세트로 검증하세요.
        </p>
      </section>

      <section className="compare-shell" aria-labelledby="price-title">
        <div className="compare-heading">
          <div>
            <p className="section-kicker">OFFICIAL API PRICE</p>
            <h2 id="price-title">표준 API 토큰 가격</h2>
          </div>
          <p>USD · 1M 토큰 기준 · 마지막 확인 {CATALOG_VERIFIED_AT}</p>
        </div>
        <div className="model-list">
          <article className="catalog-row selected">
            <div className="model-identity">
              <span
                className={`provider-dot ${model.provider.toLowerCase()}`}
                aria-hidden="true"
              />
              <div>
                <div className="model-name-line">
                  <h3>{model.name}</h3>
                  {model.status && <small>{model.status}</small>}
                </div>
                <p>
                  {model.provider} · {model.tierLabel} · {model.bestFor}
                </p>
              </div>
            </div>
            <p className="model-price">
              <strong>${usd.format(model.inputPerMillion)}</strong>
              <span>입력 / 1M</span>
            </p>
            <p className="model-price">
              <strong>${usd.format(model.outputPerMillion)}</strong>
              <span>출력 / 1M</span>
            </p>
            <div className="capability-tags">
              {model.multimodal && <span>멀티모달</span>}
              {model.batch && <span>Batch</span>}
              {model.cachedInputPerMillion !== undefined && (
                <span>캐시 ${usd.format(model.cachedInputPerMillion)}</span>
              )}
            </div>
            <Link
              className="compare-pick"
              href={`/api-cost-calculator?model=${model.id}`}
            >
              비용 계산
            </Link>
          </article>
        </div>
        <div className="catalog-note">
          <p>
            <strong>해석 기준</strong> 표시 가격은 텍스트 토큰 기준입니다.
            검색, 이미지, 도구 호출, 세금과 환율은 별도일 수 있습니다.
          </p>
          <p>
            <Link href={`/providers/${providerSlugs[model.provider]}`}>
              {model.provider} 가격 가이드 →
            </Link>
            <a href={model.source} target="_blank" rel="noreferrer">
              공식 가격표 ↗
            </a>
          </p>
        </div>
      </section>

      <section className="explain-section" aria-labelledby="alternatives-title">
        <p className="section-kicker">SAME TIER ALTERNATIVES</p>
        <h2 id="alternatives-title">같은 등급의 대안</h2>
        <div className="explain-grid">
          {alternatives.map((entry) => (
            <article key={entry.id}>
              <span>{entry.provider.slice(0, 1)}</span>
              <h3>
                <Link href={`/models/${entry.id}`}>{entry.name}</Link>
              </h3>
              <p>
                {entry.bestFor} · 입력 ${entry.inputPerMillion}, 출력 $
                {entry.outputPerMillion}
              </p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
