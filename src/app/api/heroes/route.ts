import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCached } from '@/lib/redis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('page_slug') || 'dashboard';

    // Usar cache Redis com TTL de 1 hora (degradação graciosa se Redis não disponível)
    const cacheKey = `heroes:${pageSlug}`;

    const data = await getCached(
      cacheKey,
      async () => {
        // Buscar heroes com page_slug exato OU começando com o pageSlug + '-'
        // Isso permite aceitar tanto "dashboard" quanto "dashboard-hero-xxx"
        // Otimizado: apenas campos necessários
        const { data, error } = await supabase
          .from('page_heroes')
          .select('id, title, subtitle, image_url, video_url, button_text, button_url, page_slug, position, created_at')
          .eq('is_active', true)
          .or(`page_slug.eq.${pageSlug},page_slug.like.${pageSlug}-%`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return { heroes: data || [] };
      },
      3600 // Cache por 1 hora
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heroes', heroes: [] },
      { status: 500 }
    );
  }
}
