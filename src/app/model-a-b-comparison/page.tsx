import type { Metadata } from "next";
import ComparisonExportPanel from "@/components/comparison-export-panel";
import DirectModelComparison from "@/components/direct-model-comparison";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("directComparison");

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

export default function DirectModelComparisonPage() {
  return (
    <ToolPage route={route} smoke="direct-model-comparison-page">
      <DirectModelComparison />
      <ComparisonExportPanel />
    </ToolPage>
  );
}
