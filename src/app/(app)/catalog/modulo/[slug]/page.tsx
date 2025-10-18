import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LessonsOfModule from "../LessonsOfModule";

export default async function ModuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Container>
      <Section>
        <LessonsOfModule slug={slug} />
      </Section>
    </Container>
  );
}


