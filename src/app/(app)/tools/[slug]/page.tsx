
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Container>
      <Section>
        <PageHeader title={`Ferramenta: ${slug}`} subtitle="Quizzes, diagnósticos e simuladores." />
        <Card>
          <div className="text-sm text-neutral-600">Resultado salvo no perfil (demo).</div>
        </Card>
      </Section>
    </Container>
  );
}


