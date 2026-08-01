import type { Metadata } from "next";
import ApiSelfHostedTcoCalculator from "@/components/api-self-hosted-tco-calculator";
import ToolPage from "@/components/tool-page";
import type { ToolRoute } from "@/lib/tool-routes";

const route = {
  id: "calculator",
  href: "/api-vs-self-hosted-tco",
  navLabel: "API vs 자체 호스팅",
  eyebrow: "API OR SELF-HOSTED",
  title: "API vs 자체 호스팅 TCO 계산기",
  description:
    "API 사용료와 GPU·운영비·이용률·처리량을 입력해 월간 총비용과 손익분기점을 비교하세요.",
} as unknown as ToolRoute;

export const metadata: Metadata = {
  title: `${route.title} | AI PickKit`,
  description: route.description,
  alternates: { canonical: route.href },
  openGraph: {
    title: route.title,
    description: route.description,
    url: route.href,
  },
};

export default function ApiSelfHostedTcoPage() {
  return (
    <ToolPage route={route} smoke="api-self-hosted-tco-page">
      <ApiSelfHostedTcoCalculator />
    </ToolPage>
  );
}
