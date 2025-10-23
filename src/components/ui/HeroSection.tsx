"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

interface HeroData {
  id: string;
  page_slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  hero_image_url?: string;
  background_gradient: string;
  stats: any[];
  cta_buttons: any[];
  visual_elements: any[];
  is_active: boolean;
}

interface HeroSectionProps {
  pageSlug: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export default function HeroSection({ pageSlug, fallbackTitle = "Título da Página", fallbackSubtitle = "Descrição da página" }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroData();
  }, [pageSlug]);

  async function loadHeroData() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("page_heroes")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar hero data:", error);
      } else {
        setHeroData(data);
      }
    } catch (error) {
      console.error("Erro ao carregar hero data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full py-6 sm:py-8 md:py-12 px-4 md:px-8">
        <div className="mx-auto">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900 via-purple-700 to-orange-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const data = heroData || {
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    description: "",
    hero_image_url: "",
    background_gradient: "from-purple-900 via-purple-700 to-orange-500",
    stats: [],
    cta_buttons: [],
    visual_elements: []
  };

  return (
    <div className="w-full py-6 sm:py-8 md:py-12 px-4 md:px-8">
      <div className="mx-auto">
        {data.hero_image_url ? (
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={data.hero_image_url} 
              alt={data.title || "Hero Image"}
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <div className={`w-full h-full bg-gradient-to-br ${data.background_gradient} flex items-center justify-center`}>
              <div className="text-center text-white px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">{data.title}</h1>
                {data.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">{data.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}