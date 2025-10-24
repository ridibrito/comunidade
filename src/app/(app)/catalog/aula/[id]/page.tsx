import WatchSingleClient from "./watch-single-client";

export default async function AssistirAulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WatchSingleClient id={id} />;
}


