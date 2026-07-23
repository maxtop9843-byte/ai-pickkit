import type { Metadata } from "next";
import AudioCostCalculator from "@/components/audio-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("audio");

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

export default function AudioCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="audio-cost-calculator-page">
      <AudioCostCalculator />
    </ToolPage>
  );
}
