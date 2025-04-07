import { z } from 'zod';

export const userSchema = z.object({
  username: z.string()
    .min(5, 'Nome de usuário deve ter no mínimo 5 caracteres')
    .max(10, 'Nome de usuário deve ter no máximo 10 caracteres'),
  firstName: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(12, 'Nome deve ter no máximo 12 caracteres'),
  lastName: z.string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(12, 'Sobrenome deve ter no máximo 12 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email deve ter no mínimo 5 caracteres')
    .max(25, 'Email deve ter no máximo 25 caracteres'),
  phone: z.string()
    .min(11, 'Telefone deve ter no mínimo 11 dígitos')
    .max(11, 'Telefone deve ter no máximo 11 dígitos')
    .optional(),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  confirmPassword: z.string(),
  photo: z.instanceof(File).nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type UserSchema = z.infer<typeof userSchema>;