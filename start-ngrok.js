const ngrok = require('ngrok');

async function startNgrok() {
  try {
    console.log('Iniciando ngrok...');
    const url = await ngrok.connect(3000);
    console.log('✅ Ngrok iniciado com sucesso!');
    console.log('🌐 URL pública:', url);
    console.log('🔗 URL do webhook:', `${url}/api/hotmart/webhook`);
    console.log('📋 Copie a URL acima e use na configuração da Hotmart');
    console.log('\nPressione Ctrl+C para parar o ngrok');
  } catch (error) {
    console.error('❌ Erro ao iniciar ngrok:', error);
  }
}

startNgrok();
