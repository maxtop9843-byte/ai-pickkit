import type { Metadata } from "next";
import RagCostCalculator from "@/components/rag-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("rag");

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

export default function RagCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="rag-cost-calculator-page">
      <RagCostCalculator />
    </ToolPage>
  );
}
