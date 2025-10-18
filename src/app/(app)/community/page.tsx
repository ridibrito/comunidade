"use client";

import { useState } from "react";
import { askMentora } from "./actions";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function CommunityPage() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    const res = await askMentora(q);
    setA(res);
  }
  return (
    <Container>
      <Section>
        <PageHeader title="Comunidade" subtitle="Feed, posts e comentários." />
        <Card>
          <div className="font-medium mb-2">Mentora (demo)</div>
          <form onSubmit={onAsk} className="flex gap-2">
            <input
              className="flex-1 h-10 px-3 rounded-xl border"
              placeholder="Pergunte algo"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="px-4 h-10 rounded-xl bg-brand text-white hover:bg-brand/90">Enviar</button>
          </form>
          {a && <div className="mt-3 text-sm whitespace-pre-wrap">{a}</div>}
        </Card>
      </Section>
    </Container>
  );
}


