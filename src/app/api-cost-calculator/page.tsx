import type { Metadata } from "next";
import CostCalculator from "@/components/cost-calculator";
import ServiceUsagePresets from "@/components/service-usage-presets";
import ToolPage from "@/components/tool-page";
import { parseCalculatorState } from "@/lib/cost-calculator";
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

export default async function ApiCostCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(rawParams)) {
    const firstValue = Array.isArray(value) ? value[0] : value;
    if (firstValue !== undefined) params.set(key, firstValue);
  }
  const initialState = parseCalculatorState(params);

  return (
    <ToolPage route={route} smoke="api-cost-calculator-page">
      <ServiceUsagePresets activeId={initialState.presetId} />
      <CostCalculator
        initialState={initialState}
        syncUrl
        showAdvancedInitially={params.has("input") || params.has("output")}
      />
    </ToolPage>
  );
}
