import type { Metadata } from "next";
import ToolPage from "@/components/tool-page";
import UsageBillingAnalyzer from "@/components/usage-billing-analyzer";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("usageBilling");

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

export default function UsageBillingAnalyzerPage() {
  return (
    <ToolPage route={route} smoke="usage-billing-analyzer-page">
      <UsageBillingAnalyzer />
    </ToolPage>
  );
}
