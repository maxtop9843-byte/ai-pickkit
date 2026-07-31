import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import "./theme.css";
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
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <style dangerouslySetInnerHTML={{ __html: toolUiCss }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
