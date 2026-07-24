import type { Metadata } from "next";
import FreeCreditRunwayCalculator from "@/components/free-credit-runway-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("freeCredit");

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

export default function FreeCreditRunwayCalculatorPage() {
  return (
    <ToolPage route={route} smoke="free-credit-runway-calculator-page">
      <FreeCreditRunwayCalculator />
    </ToolPage>
  );
}
