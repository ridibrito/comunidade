import { CardCourse } from "@/components/CardCourse";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";

export default function CatalogPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Catálogo" subtitle="Explore cursos, trilhas, livros e ferramentas." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardCourse key={i} title={`Curso ${i + 1}`} lessons={12 + i} progress={(i + 1) * 8} />
          ))}
        </div>
      </Section>
    </Container>
  );
}


