interface BookPageProps {
  params: { slug: string };
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Livro: {params.slug}</h1>
      <p className="text-muted-foreground mt-2">Visualização de PDF e anotações.</p>
    </main>
  );
}


