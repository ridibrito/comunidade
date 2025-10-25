import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('page_slug') || 'dashboard';

    // Buscar heroes com page_slug exato OU começando com o pageSlug + '-'
    // Isso permite aceitar tanto "dashboard" quanto "dashboard-hero-xxx"
    const { data, error } = await supabase
      .from('page_heroes')
      .select('*')
      .eq('is_active', true)
      .or(`page_slug.eq.${pageSlug},page_slug.like.${pageSlug}-%`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ heroes: data || [] });
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heroes' },
      { status: 500 }
    );
  }
}
