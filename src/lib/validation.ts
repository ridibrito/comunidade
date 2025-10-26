// lib/validation.ts
import { z } from 'zod';

// Schemas de validação para diferentes tipos de dados
export const emailSchema = z.string()
  .email('Email inválido')
  .min(5, 'Email muito curto')
  .max(254, 'Email muito longo')
  .toLowerCase()
  .trim();

export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número');

export const nameSchema = z.string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
  .trim();

export const phoneSchema = z.string()
  .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXX-XXXX')
  .optional();

export const cpfSchema = z.string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
  .refine((cpf) => {
    // Validação básica de CPF
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Algoritmo de validação de CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(numbers[9]) !== digit1) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(numbers[10]) === digit2;
  }, 'CPF inválido');

// Schema para dados de usuário
export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: nameSchema,
  phone: phoneSchema,
  cpf: cpfSchema.optional(),
});

// Schema para dados de perfil
export const profileSchema = z.object({
  full_name: nameSchema,
  phone: phoneSchema,
  avatar_url: z.string().url().optional(),
  zip: z.string().max(10).optional(),
  street: z.string().max(200).optional(),
  number: z.string().max(20).optional(),
  complement: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
});

// Schema para dados de login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema para recuperação de senha
export const passwordResetSchema = z.object({
  email: emailSchema,
});

// Schema para alteração de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Função auxiliar para sanitizar strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente perigosos
    .replace(/\s+/g, ' '); // Normalizar espaços
}

// Função para validar e sanitizar dados
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Função para verificar força da senha
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Use pelo menos 8 caracteres');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Adicione letras minúsculas');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Adicione letras maiúsculas');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Adicione números');

  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Adicione símbolos especiais');

  if (password.length >= 12) score += 1;

  return { score, feedback };
}
