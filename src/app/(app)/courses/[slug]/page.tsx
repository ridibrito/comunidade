interface CoursePageProps {
  params: { slug: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Curso: {params.slug}</h1>
      <p className="text-muted-foreground mt-2">Módulos e aulas deste curso.</p>
    </main>
  );
}


