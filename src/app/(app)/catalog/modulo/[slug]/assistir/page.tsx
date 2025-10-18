import WatchClient from "./watch-client";

export default async function AssistirModuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WatchClient slug={slug} />;
}


