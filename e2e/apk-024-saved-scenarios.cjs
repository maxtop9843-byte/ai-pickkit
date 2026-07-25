const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const outputDir = "artifacts/apk-024";

async function verifyViewport(browser, name, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseURL}/model-a-b-comparison`, {
    waitUntil: "networkidle",
  });

  await page.getByRole("heading", { name: "비용 시나리오 저장" }).waitFor();
  await page.getByText("저장된 시나리오가 없습니다.").waitFor();

  const nameInput = page.getByLabel("시나리오 이름").first();
  await nameInput.fill("모바일 API 예산");
  await page.getByLabel("월간 요청 수").fill("42000");
  await page.getByRole("button", { name: "현재 값 저장" }).click();
  await page.getByText("“모바일 API 예산”을 저장했습니다.").waitFor();

  await page.reload({ waitUntil: "networkidle" });
  const savedNameInput = page.locator('input[value="모바일 API 예산"]');
  await savedNameInput.waitFor();

  await savedNameInput.fill("모바일 API 예산 v2");
  await savedNameInput.press("Tab");
  await page.getByText("시나리오 이름을 변경했습니다.").waitFor();

  await page.getByRole("button", { name: "복제" }).click();
  await page
    .getByText("“모바일 API 예산 v2 복사본”을 만들었습니다.")
    .waitFor();
  assert.equal(
    await page.getByRole("button", { name: "불러오기" }).count(),
    2,
  );

  await page.getByLabel("월간 요청 수").fill("1");
  await page.getByRole("button", { name: "불러오기" }).last().click();
  assert.equal(
    await page.getByLabel("월간 요청 수").inputValue(),
    "42000",
  );

  await page.getByRole("button", { name: "삭제" }).first().click();
  assert.equal(
    await page.getByRole("button", { name: "불러오기" }).count(),
    1,
  );

  const horizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  assert.equal(
    horizontalOverflow,
    false,
    `${name}: page has horizontal overflow`,
  );

  const touchTargets = await page
    .locator("button")
    .evaluateAll((buttons) =>
      buttons.map((button) => ({
        text: button.textContent?.trim(),
        height: button.getBoundingClientRect().height,
      })),
    );
  if (viewport.width < 768) {
    for (const target of touchTargets) {
      assert.ok(target.height >= 44, `${name}: ${target.text} is below 44px`);
    }
  }

  await page.screenshot({
    path: `${outputDir}/${name}.png`,
    fullPage: true,
  });

  assert.deepEqual(errors, [], `${name}: browser errors detected`);
  await context.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    await verifyViewport(browser, "desktop-1440", {
      width: 1440,
      height: 1000,
    });
    await verifyViewport(browser, "mobile-390", { width: 390, height: 844 });
  } finally {
    await browser.close();
  }
})();
