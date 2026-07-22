import type { Metadata } from "next";
import ModelSelector from "@/components/model-selector";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("selector");

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

export default function ModelSelectorPage() {
  return (
    <ToolPage route={route} smoke="model-selector-page">
      <ModelSelector />
    </ToolPage>
  );
}
