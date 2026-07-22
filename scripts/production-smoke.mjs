const origin = process.env.PRODUCTION_URL ?? "https://aipickkit.com";
const attempts = Number(process.env.SMOKE_ATTEMPTS ?? 18);
const delayMs = Number(process.env.SMOKE_DELAY_MS ?? 10000);
const checks = [
  { path: "/", contains: 'data-smoke="home"' },
  { path: "/", contains: 'id="calculator"' },
  { path: "/", contains: 'data-smoke="model-comparison"' },
  { path: "/", contains: 'data-smoke="model-selector"' },
  {
    path: "/api-cost-calculator",
    contains: 'data-smoke="api-cost-calculator-page"',
  },
  { path: "/api-cost-calculator", contains: 'id="calculator"' },
  {
    path: "/api-cost-calculator",
    contains: 'data-smoke="calculator-share-controls"',
  },
  {
    path: "/api-cost-calculator?preset=coding&users=321&requests=7&input=9000&output=2500",
    contains: 'value="321"',
  },
  {
    path: "/prompt-token-calculator",
    contains: 'data-smoke="prompt-token-calculator-page"',
  },
  {
    path: "/prompt-token-calculator",
    contains: 'data-smoke="prompt-cost-estimator"',
  },
  { path: "/models", contains: 'data-smoke="models-page"' },
  { path: "/models", contains: 'data-smoke="model-comparison"' },
  { path: "/model-selector", contains: 'data-smoke="model-selector-page"' },
  { path: "/model-selector", contains: 'data-smoke="model-selector"' },
  {
    path: "/robots.txt",
    contains: "Sitemap: https://aipickkit.com/sitemap.xml",
  },
  { path: "/sitemap.xml", contains: "https://aipickkit.com" },
  {
    path: "/sitemap.xml",
    contains: "https://aipickkit.com/api-cost-calculator",
  },
  { path: "/sitemap.xml", contains: "https://aipickkit.com/models" },
  {
    path: "/sitemap.xml",
    contains: "https://aipickkit.com/prompt-token-calculator",
  },
  {
    path: "/sitemap.xml",
    contains: "https://aipickkit.com/model-selector",
  },
];
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
async function verify() {
  for (const check of checks) {
    const response = await fetch(`${origin}${check.path}`, {
      redirect: "follow",
      headers: { "user-agent": "AI-PickKit-Production-Smoke/1.0" },
    });
    const body = await response.text();
    if (!response.ok)
      throw new Error(`${check.path} returned HTTP ${response.status}`);
    if (!body.includes(check.contains))
      throw new Error(
        `${check.path} is missing ${JSON.stringify(check.contains)}`,
      );
  }
}
let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verify();
    console.log(`Production smoke passed for ${origin} on attempt ${attempt}.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await wait(delayMs);
  }
}
throw lastError;
