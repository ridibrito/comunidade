// Configurações da aplicação
export const config = {
  // URLs da aplicação
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // URLs do Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Configurações de email
  mailFrom: process.env.MAIL_FROM || 'Comunidade Coruss <noreply@aldeiasingular.com.br>',
  
  // URLs de redirecionamento
  getResetUrl: (token?: string, email?: string) => {
    const baseUrl = config.appUrl;
    if (token && email) {
      return `${baseUrl}/auth/reset?type=invite&token=${token}&email=${encodeURIComponent(email)}`;
    }
    return `${baseUrl}/auth/reset`;
  },
  
  // URLs do Supabase para configuração
  getSupabaseRedirectUrls: () => {
    const baseUrl = config.appUrl;
    return [
      `${baseUrl}/auth/reset`,
      `${baseUrl}/auth/login`,
      `${baseUrl}/dashboard`
    ];
  }
};

// Validação de configuração
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Configurações faltando:', missing);
  }
  
  return missing.length === 0;
}
