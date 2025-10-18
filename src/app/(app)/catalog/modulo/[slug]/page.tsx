import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LessonsOfModule from "../LessonsOfModule";

interface PageProps { params: { slug: string } }

export default function ModuloPage({ params }: PageProps) {
  return (
    <Container>
      <Section>
        <LessonsOfModule slug={params.slug} />
      </Section>
    </Container>
  );
}


