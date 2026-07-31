import type { Metadata } from "next";
import SubscriptionApiComparison from "@/components/subscription-api-comparison";
import ToolPage from "@/components/tool-page";
import { getToolRoute } from "@/lib/tool-routes";

const route = getToolRoute("subscriptionApi");

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

export default function SubscriptionApiComparisonPage() {
  return (
    <ToolPage route={route} smoke="subscription-api-comparison-page">
      <SubscriptionApiComparison />
    </ToolPage>
  );
}
