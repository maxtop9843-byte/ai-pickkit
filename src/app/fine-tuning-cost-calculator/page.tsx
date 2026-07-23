import type { Metadata } from "next";
import FineTuningCostCalculator from "@/components/fine-tuning-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("fineTuning");

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

export default function FineTuningCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="fine-tuning-cost-calculator-page">
      <FineTuningCostCalculator />
    </ToolPage>
  );
}
