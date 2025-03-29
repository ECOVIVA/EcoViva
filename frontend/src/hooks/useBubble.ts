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
        
    // Função para buscar a bolha
    const fetchBubble = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bubble/profile/`);
        if (response.ok) {
          const data = await response.json();
          setBubble(data);
        }
        else {
          throw new Error(`Erro ao buscar a bolha: ${response.status} ${response.statusText}`);
        }
      } catch (err: any) {
        setError(`Erro ao buscar bolha: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBubble();
  }, [username]);

  return { bubble, loading, error };
};
