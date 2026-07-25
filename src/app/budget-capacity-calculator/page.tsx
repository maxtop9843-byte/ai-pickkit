import type { Metadata } from "next";
import BudgetCapacityCalculator from "@/components/budget-capacity-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("budgetCapacity");

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

export default function BudgetCapacityCalculatorPage() {
  return (
    <ToolPage route={route} smoke="budget-capacity-calculator-page">
      <BudgetCapacityCalculator />
    </ToolPage>
  );
}
