import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import "./theme.css";
import { allToolsUiCss } from "./all-tools-ui";
import { motionUiCss } from "./motion-ui";
import { toolUiCss } from "./tool-ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitializationScript = `
(() => {
  try {
    const preference = localStorage.getItem("pickkit-theme") || "system";
    const validPreference = ["system", "light", "dark"].includes(preference)
      ? preference
      : "system";
    const resolved = validPreference === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : validPreference;
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themePreference = validPreference;
    root.style.colorScheme = resolved;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();`;

// Reuses the same section-shell class list all-tools-ui.ts already styles as one
// design-system layer, so every tool page gets scroll-reveal with zero per-page markup.
const REVEAL_SELECTOR = [
  ".calculator-shell",
  ".compare-shell",
  ".selector-shell",
  ".prompt-estimator-shell",
  ".savings-shell",
  ".home-tool-directory",
  ".prompt-tool-band",
  ".explain-section",
  ".tools-directory .tool-group",
  ".tool-shell",
  ".prompt-tool-shell",
  ".batch-cache-shell",
  ".image-cost-shell",
  ".speech-cost-shell",
  ".rag-cost-shell",
  ".fine-tuning-shell",
  ".agent-cost-shell",
  ".provider-budget-shell",
  ".credit-runway-shell",
  ".composite-cost-shell",
  ".direct-comparison-shell",
  ".scenario-shell",
  ".budget-capacity-shell",
  ".models-shell",
].join(",");

const scrollRevealScript = `
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  const scan = () => document.querySelectorAll("${REVEAL_SELECTOR}").forEach((el) => {
    if (!el.classList.contains("is-revealed")) io.observe(el);
  });
  const start = () => {
    scan();
    // Client-side route transitions swap content without firing DOMContentLoaded again.
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  };
  document.body ? start() : document.addEventListener("DOMContentLoaded", start);
})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://aipickkit.com"),
  title: "AI 모델 추천·가격 비교·API 비용 계산기 | AI PickKit",
  description:
    "목적에 맞는 AI 모델을 추천받고 OpenAI·Anthropic·Google의 공식 API 가격과 월 예상 비용을 비교하세요.",
  alternates: { canonical: "/" },
  verification: {
    other: {
      "naver-site-verification": "43cfdf15b2fd881e68658f1f24e0a272ca51dece",
    },
  },
  openGraph: {
    title: "내 목적에 맞는 AI 모델을 찾고 비용까지 비교하세요",
    description:
      "목적 기반 모델 추천, 공식 API 가격 비교와 초보자용 비용 계산기",
    url: "https://aipickkit.com",
    siteName: "AI PickKit",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <script dangerouslySetInnerHTML={{ __html: scrollRevealScript }} />
        <style dangerouslySetInnerHTML={{ __html: toolUiCss }} />
        <style dangerouslySetInnerHTML={{ __html: allToolsUiCss }} />
        <style dangerouslySetInnerHTML={{ __html: motionUiCss }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
