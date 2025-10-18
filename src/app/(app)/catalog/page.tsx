import { CardCourse } from "@/components/CardCourse";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Carousel from "@/components/ui/Carousel";

export default function CatalogPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Catálogo" subtitle="Explore cursos, trilhas, livros e ferramentas." />
        <Carousel cardWidth={280} gap={24}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-full">
              <CardCourse title={`Curso ${i + 1}`} lessons={12 + i} progress={(i + 1) * 8} />
            </div>
          ))}
        </Carousel>
      </Section>
    </Container>
  );
}


