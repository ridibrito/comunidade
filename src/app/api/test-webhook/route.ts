import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', body);
    console.log('========================');
    
    // Simular resposta da Hotmart
    return NextResponse.json({ 
      message: 'Webhook de teste recebido com sucesso!',
      received_at: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries()),
      body: JSON.parse(body)
    });
  } catch (error) {
    console.error('Erro no webhook de teste:', error);
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint de teste do webhook ativo',
    timestamp: new Date().toISOString(),
    url: 'https://enumerable-lynetta-soupiest.ngrok-free.dev/api/hotmart/webhook'
  });
}