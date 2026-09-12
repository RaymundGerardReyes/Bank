import { redirect } from "next/navigation";

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const resolvedParams = await params;
  // Fallback guard: redirect to the authoritative checkout page where state is finalized and locked
  redirect(`/checkout/${resolvedParams.sessionId}`);
}

