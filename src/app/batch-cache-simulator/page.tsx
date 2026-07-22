import type { Metadata } from "next";
import SavingsSimulator from "@/components/savings-simulator";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("savings");

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

export default function BatchCacheSimulatorPage() {
  return (
    <ToolPage route={route} smoke="batch-cache-simulator-page">
      <SavingsSimulator />
    </ToolPage>
  );
}
