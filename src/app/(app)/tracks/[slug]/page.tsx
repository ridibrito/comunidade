interface TrackPageProps {
  params: { slug: string };
}

export default function TrackPage({ params }: TrackPageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Trilha: {params.slug}</h1>
      <p className="text-muted-foreground mt-2">Curadoria de conteúdos com progresso.</p>
    </main>
  );
}


