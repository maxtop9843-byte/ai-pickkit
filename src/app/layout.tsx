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
  title: "AI 모델 가격 비교·API 비용 계산기 | AI PickKit",
  description:
    "OpenAI·Anthropic·Google AI 모델의 공식 API 가격과 용도를 비교하고 월 예상 비용을 계산하세요.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI 모델, 가격과 쓰임을 한눈에 비교하세요",
    description: "공식 API 가격 기반 모델 비교와 초보자용 비용 계산기",
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
