import type { Metadata } from "next";
import ModelComparison from "@/components/model-comparison";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("models");

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

export default function ModelsPage() {
  return (
    <ToolPage route={route} smoke="models-page">
      <ModelComparison />
    </ToolPage>
  );
}
