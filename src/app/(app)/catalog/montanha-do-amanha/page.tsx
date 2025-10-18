"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MontanhaAmanhaPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const modules = [
    { title: "Aspectos Cognitivos", slug: "/catalog/modulo/aspectos-cognitivos", img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop" },
    { title: "Aspectos Socioemocionais", slug: "/catalog/modulo/aspectos-socioemocionais", img: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop" },
    { title: "Rotina e Organização", slug: "#", img: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop" },
    { title: "Desenvolvimento Motor", slug: "#", img: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop" },
    { title: "Criatividade", slug: "#", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" },
    { title: "Interesses Específicos", slug: "#", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop" },
  ];

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function scrollByCards(cards: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const style = getComputedStyle(el);
    const gap = parseInt(style.getPropertyValue("gap") || style.getPropertyValue("column-gap") || "16");
    const cardWidth = first?.getBoundingClientRect().width ?? 320;
    el.scrollBy({ left: (cardWidth + gap) * cards, behavior: "smooth" });
    // update after animation
    setTimeout(updateArrows, 350);
  }

  return (
    <Container>
      <Section>
        <PageHeader title="Montanha do amanhã" />
        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Identificação - Treinando o seu olhar de Coruja</h2>
              <div className="relative overflow-x-hidden">
              <div className="flex gap-4 overflow-x-hidden snap-x snap-mandatory" ref={scrollerRef}>
                {modules.map((m, idx) => (
                  <Link key={idx} href={m.slug} className="w-[320px] xl:w-[360px] shrink-0 snap-start rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)] hover:brightness-110">
                    <div className="aspect-[16/9] bg-[var(--hover)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.img} alt="capa" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 text-sm font-medium truncate">{m.title}</div>
                  </Link>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                <button onClick={() => scrollByCards(-1)} disabled={!canLeft} className={`pointer-events-auto h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur ${canLeft?"hover:bg-[var(--hover)]":"opacity-40 cursor-not-allowed"}`}>◀</button>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <button onClick={() => scrollByCards(1)} disabled={!canRight} className={`pointer-events-auto h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur ${canRight?"hover:bg-[var(--hover)]":"opacity-40 cursor-not-allowed"}`}>▶</button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Avaliação</h2>
            <div className="flex flex-wrap gap-4">
              <div className="w-[320px] xl:w-[360px] rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
                <div className="aspect-[16/9] bg-[var(--hover)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop" alt="capa" className="block w-full h-full object-cover" />
                </div>
                <div className="p-3 text-sm font-medium truncate">Avaliação – Introdução</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}


