import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authService = {
  login: async (loginData: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Token recebido da API:", response.data.token); // <-- Adicione esta linha
      return response.data; // { token }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
      }
      throw new Error('Erro desconhecido ao fazer login');
    }
  }
};