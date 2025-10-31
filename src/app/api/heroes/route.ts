import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('page_slug') || 'dashboard';

    // Buscar heroes diretamente (sem cache por enquanto para debug)
    // Buscar heroes com page_slug exato OU começando com pageSlug- (para suportar múltiplos heroes por página)
    // Incluir todos os campos necessários para o HeroCarousel
    const { data, error } = await supabase
      .from('page_heroes')
      .select('id, title, subtitle, hero_image_url, background_gradient, cta_buttons, title_position, subtitle_position, page_slug, created_at')
      .eq('is_active', true)
      .or(`page_slug.eq.${pageSlug},page_slug.ilike.${pageSlug}-hero-%`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error fetching heroes:', error);
      return NextResponse.json(
        { error: error.message, heroes: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ heroes: data || [] });
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch heroes', heroes: [] },
      { status: 500 }
    );
  }
}
