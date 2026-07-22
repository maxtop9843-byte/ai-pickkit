import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aipickkit.com"),
  title: "AI 모델 추천·가격 비교·API 비용 계산기 | AI PickKit",
  description:
    "목적에 맞는 AI 모델을 추천받고 OpenAI·Anthropic·Google의 공식 API 가격과 월 예상 비용을 비교하세요.",
  alternates: { canonical: "/" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
