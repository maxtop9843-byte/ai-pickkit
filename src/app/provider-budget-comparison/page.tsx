import type { Metadata } from "next";
import ProviderBudgetComparison from "@/components/provider-budget-comparison";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("providerBudget");

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

export default function ProviderBudgetComparisonPage() {
  return (
    <ToolPage route={route} smoke="provider-budget-comparison-page">
      <ProviderBudgetComparison />
    </ToolPage>
  );
}
