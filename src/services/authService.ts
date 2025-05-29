import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (loginData: { email: string; password: string }) => {
    try {
      console.log("Dados de login enviados:", loginData);
      const response = await axios.post(`${API_URL}api/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Token recebido da API:", response.data.token); 
      return response.data; // { token }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao fazer login:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'pastel');
      }
      throw new Error('Erro desconhecido ao fazer login');
    }
  }
};