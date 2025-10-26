import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log('Webhook recebido:', body);
    
    return NextResponse.json({ 
      message: 'Webhook de teste recebido com sucesso!',
      received_at: new Date().toISOString(),
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
    timestamp: new Date().toISOString()
  });
}
