export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Curso: {slug}</h1>
      <p className="text-muted-foreground mt-2">Módulos e aulas deste curso.</p>
    </main>
  );
}


