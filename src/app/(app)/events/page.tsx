import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function EventsPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Eventos" subtitle="Lives, webinários e encontros." />
        <Card>
          <button className="px-4 h-10 rounded-xl bg-brand text-white hover:bg-brand/90">Participar (enviar lembrete)</button>
        </Card>
      </Section>
    </Container>
  );
}


