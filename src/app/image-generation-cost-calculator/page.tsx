import type { Metadata } from "next";
import ImageCostCalculator from "@/components/image-cost-calculator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("images");

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

export default function ImageGenerationCostCalculatorPage() {
  return (
    <ToolPage route={route} smoke="image-generation-cost-calculator-page">
      <ImageCostCalculator />
    </ToolPage>
  );
}
