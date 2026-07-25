import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  CATALOG_VERIFIED_AT,
  catalogModels,
  providerSources,
  type Provider,
} from "../src/lib/model-catalog.ts";
import {
  buildPriceFreshnessReport,
  type SourceCheck,
} from "../src/lib/price-freshness.ts";

const outputPath = resolve(
  process.env.PRICE_FRESHNESS_REPORT ??
    `reports/price-freshness/${new Date().toISOString().slice(0, 10)}.md`,
);
const staleAfterDays = Number(process.env.PRICE_STALE_AFTER_DAYS ?? "14");

async function checkSource(provider: Provider): Promise<SourceCheck> {
  const source = providerSources[provider];
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(source.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "AI-PickKit-Price-Freshness/1.0",
        accept: "text/html,application/xhtml+xml",
      },
    });
    await response.body?.cancel();
    return {
      provider,
      url: source.url,
      ok: response.ok,
      status: response.status,
      checkedAt,
    };
  } catch (error) {
    return {
      provider,
      url: source.url,
      ok: false,
      status: null,
      checkedAt,
      error: error instanceof Error ? error.message : "unknown error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

const providers = Object.keys(providerSources) as Provider[];
const sourceChecks = await Promise.all(providers.map(checkSource));
const report = buildPriceFreshnessReport({
  models: catalogModels,
  sources: providerSources,
  catalogVerifiedAt: CATALOG_VERIFIED_AT,
  sourceChecks,
  now: new Date(),
  staleAfterDays,
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, report.markdown, "utf8");
console.log(report.markdown);
console.log(`\nReport written to ${outputPath}`);

if (report.candidates.length > 0) {
  console.log(
    `Found ${report.candidates.length} price freshness candidate(s).`,
  );
}
