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
  title: "AI API 비용 계산기 | AI PickKit",
  description:
    "사용자 수와 질문 횟수만으로 AI API 월 예상 비용을 계산하고 저비용·균형형·고품질 모델을 비교하세요.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "내 AI 서비스, 한 달에 얼마일까?",
    description: "토큰을 몰라도 계산하는 초보자용 AI API 비용 계산기",
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
