import { z } from "zod";

// Schema para a validação
export const checkInSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Descreva sua ação sustentável" })
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres" }),
});

//o tipo de resposta para a API1
export type ApiError = {
  status: number;
  message: string;
  detail?: string;
};

export const parseApiError = (error: unknown): ApiError => {
  // Handle axios resposta de axios!
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    
    if (response?.data) {
     // retorna general API erro!
      return {
        status: response.status || 500,
        message: response.data.message || response.data.detail || "Um novo Check-in só pode ser feito após 24 horas.",
        detail: response.data.detail
      };
    }
  }
  
  //error padrão!
  return {
    status: 500,
    message: "Erro ao conectar com o servidor",
  };
};