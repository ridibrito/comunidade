// Script para testar a API de usuários
const testAPI = async () => {
  try {
    console.log('Testando API de usuários...');
    
    const response = await fetch('http://localhost:3000/api/admin/users');
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    if (data.users) {
      console.log('Usuários encontrados:', data.users.length);
      data.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name || 'Sem nome'} (${user.email || user.id}) - ${user.role || 'Sem role'}`);
      });
    } else {
      console.log('Nenhum usuário encontrado ou estrutura de dados inesperada');
    }
    
  } catch (error) {
    console.error('Erro ao testar API:', error);
  }
};

// Executar o teste
testAPI();
