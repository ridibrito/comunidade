export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Livro: {slug}</h1>
      <p className="text-muted-foreground mt-2">Visualização de PDF e anotações.</p>
    </main>
  );
}


