export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Trilha: {slug}</h1>
      <p className="text-muted-foreground mt-2">Curadoria de conteúdos com progresso.</p>
    </main>
  );
}


