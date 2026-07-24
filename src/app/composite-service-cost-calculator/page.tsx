import type { Metadata } from "next";
import CompositeServiceCostCalculator from "@/components/composite-service-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("compositeService");

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

export default function CompositeServiceCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="composite-service-cost-calculator-page">
      <CompositeServiceCostCalculator />
    </ToolPage>
  );
}
