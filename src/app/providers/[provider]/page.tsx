import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CATALOG_VERIFIED_AT } from "@/lib/model-catalog";
import {
  providerBySlug,
  providerGuide,
  providerSlugs,
} from "@/lib/model-guides";

export function generateStaticParams() {
  return Object.values(providerSlugs).map((provider) => ({ provider }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>;
}): Promise<Metadata> {
  const { provider: slug } = await params;
  const provider = providerBySlug[slug];
  if (!provider) return {};
  const title = `${provider} API 가격·모델 가이드 | AI PickKit`;
  const description = `${provider}의 AI 모델별 입력·출력·캐시 가격과 추천 용도, Batch·멀티모달 지원을 공식 출처 기준으로 비교하세요.`;
  const canonical = `/providers/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

const usd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default async function ProviderGuidePage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: slug } = await params;
  const provider = providerBySlug[slug];
  if (!provider) notFound();
  const guide = providerGuide(provider);

  return (
    <main className="tool-page" data-smoke="provider-price-guide">
      <SiteHeader />
      <section
        className="tool-page-intro"
        aria-labelledby="provider-guide-title"
      >
        <div>
          <Link href="/">AI PickKit</Link>
          <span aria-hidden="true">/</span>
          <Link href="/models">모델 비교</Link>
          <span aria-hidden="true">/</span>
          <span>{provider}</span>
        </div>
        <p className="section-kicker">PROVIDER PRICE GUIDE</p>
        <h1 id="provider-guide-title">{provider} API 가격 가이드</h1>
        <p>{guide.copy.summary}</p>
      </section>

      <section
        className="compare-shell"
        aria-labelledby="provider-models-title"
      >
        <div className="compare-heading">
          <div>
            <p className="section-kicker">
              MODEL LINEUP · {guide.models.length}
            </p>
            <h2 id="provider-models-title">모델별 표준 API 가격</h2>
          </div>
          <p>USD · 1M 토큰 기준 · 마지막 확인 {CATALOG_VERIFIED_AT}</p>
        </div>
        <div className="model-list">
          <div className="catalog-row catalog-row-head" aria-hidden="true">
            <span>모델 / 추천 용도</span>
            <span>입력</span>
            <span>출력</span>
            <span>지원</span>
            <span>상세</span>
          </div>
          {guide.models.map((model) => (
            <article className="catalog-row" key={model.id}>
              <div className="model-identity">
                <span
                  className={`provider-dot ${provider.toLowerCase()}`}
                  aria-hidden="true"
                />
                <div>
                  <div className="model-name-line">
                    <h3>{model.name}</h3>
                    {model.status && <small>{model.status}</small>}
                  </div>
                  <p>
                    {model.tierLabel} · {model.bestFor}
                  </p>
                </div>
              </div>
              <p className="model-price">
                <strong>${usd.format(model.inputPerMillion)}</strong>
                <span>/ 1M tokens</span>
              </p>
              <p className="model-price">
                <strong>${usd.format(model.outputPerMillion)}</strong>
                <span>/ 1M tokens</span>
              </p>
              <div className="capability-tags">
                {model.multimodal && <span>멀티모달</span>}
                {model.batch && <span>Batch</span>}
                {model.cachedInputPerMillion !== undefined && <span>캐시</span>}
              </div>
              <Link className="compare-pick" href={`/models/${model.id}`}>
                상세 보기
              </Link>
            </article>
          ))}
        </div>
        <div className="catalog-note">
          <p>
            <strong>가격 기준</strong> 표준 텍스트 API 가격입니다. 입력 길이
            구간, 검색, 이미지, 도구 호출과 프로모션 종료일은 공식 문서를
            확인하세요.
          </p>
          <p>
            <a href={guide.source.url} target="_blank" rel="noreferrer">
              {guide.source.label} ↗
            </a>
            <Link href="/api-cost-calculator">사용량으로 월 비용 계산 →</Link>
          </p>
        </div>
      </section>

      <section
        className="explain-section"
        aria-labelledby="provider-notes-title"
      >
        <p className="section-kicker">CHOOSING NOTES</p>
        <h2 id="provider-notes-title">선택 전 확인할 점</h2>
        <div className="explain-grid">
          <article>
            <span>+</span>
            <h3>강점</h3>
            <p>{guide.copy.strengths.join(" · ")}</p>
          </article>
          <article>
            <span>!</span>
            <h3>주의</h3>
            <p>{guide.copy.caveats.join(" · ")}</p>
          </article>
          <article>
            <span>→</span>
            <h3>다음 단계</h3>
            <p>
              후보 2~3개를 실제 프롬프트 20~50개로 평가하고 품질과 월 비용을
              함께 비교하세요.
            </p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
