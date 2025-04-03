import { useState, useEffect } from 'react';
import { Bubble } from "../types/types";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const useBubble = (username: string) => {
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!username) {
      setError("O nome de usuário não é válido.");
      setLoading(false);
      return;
    }

    console.log("Buscando bolha para:", username); // Verifique se o username é válido
    
    // Função para buscar a bolha
    const fetchBubble = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bubble/${username}/`);
        if (response.ok) {
          const data = await response.json();
          setBubble(data);
        } else if (response.status === 404) {
          // Se a bolha não existir, cria a bolha automaticamente
          await createBubble(username);
        } else {
          throw new Error(`Erro ao buscar a bolha: ${response.status} ${response.statusText}`);
        }
      } catch (err: any) {
        setError(`Erro ao buscar bolha: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Função para criar a bolha
    const createBubble = async (username: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/bubble/${username}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: username }), // Dados para criar a bolha
        });
        
        if (response.ok) {
          fetchBubble(); // Recarrega a bolha depois de criada
        } else {
          throw new Error('Erro ao criar bolha');
        }
      } catch (err: any) {
        setError(`Erro ao criar bolha: ${err.message}`);
      }
    };

    fetchBubble();
  }, [username]);

  return { bubble, loading, error };
};
