import type { Metadata } from "next";
import PromptCostEstimator from "@/components/prompt-cost-estimator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("prompt");

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

export default function PromptTokenCalculatorPage() {
  return (
    <ToolPage route={route} smoke="prompt-token-calculator-page">
      <PromptCostEstimator />
    </ToolPage>
  );
}
