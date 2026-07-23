import type { Metadata } from "next";
import AgentToolCostCalculator from "@/components/agent-tool-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("agentTools");

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

export default function AgentToolCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="agent-tool-cost-calculator-page">
      <AgentToolCostCalculator />
    </ToolPage>
  );
}
