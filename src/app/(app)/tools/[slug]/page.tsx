interface ToolPageProps {
  params: { slug: string };
}

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function ToolPage({ params }: ToolPageProps) {
  return (
    <Container>
      <Section>
        <PageHeader title={`Ferramenta: ${params.slug}`} subtitle="Quizzes, diagnósticos e simuladores." />
        <Card>
          <div className="text-sm text-neutral-600">Resultado salvo no perfil (demo).</div>
        </Card>
      </Section>
    </Container>
  );
}


