import type { Metadata } from "next";
import CostCalculator from "@/components/cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("calculator");

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

export default function ApiCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="api-cost-calculator-page">
      <CostCalculator />
    </ToolPage>
  );
}
