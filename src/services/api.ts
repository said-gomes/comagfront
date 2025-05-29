import axios from 'axios';

// Modificação para Vite (import.meta.env)
console.log('API URL:', import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Orçamentos
  createBudget: async (data: BudgetData) => {
    try {
      const response = await api.post('/api/budgets', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao enviar orçamento');
      }
      throw new Error('Erro desconhecido ao enviar orçamento');
    }
  },

  // Produtos
  getProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao carregar produtos');
      }
      throw new Error('Erro desconhecido ao carregar produtos');
    }
  },

  updateProduct: async (id: string, data: Product) => {
    try {
      const response = await api.put(`/api/products/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao atualizar produto');
      }
      throw new Error('Erro desconhecido ao atualizar produto');
    }
  },

  createProduct: async (data: Product) => {
    try {
      const response = await api.post('/api/products', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao criar produto');
      }
      throw new Error('Erro desconhecido ao criar produto');
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao deletar produto');
      }
      throw new Error('Erro desconhecido ao deletar produto');
    }
  },

  // Serviços
  getServices: async () => {
    try {
      const response = await api.get('/api/services');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao carregar serviços');
      }
      throw new Error('Erro desconhecido ao carregar serviços');
    }
  },

  updateService: async (id: string, data: Service) => {
    try {
      const response = await api.put(`/api/services/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao atualizar serviço');
      }
      throw new Error('Erro desconhecido ao atualizar serviço');
    }
  },

  createService: async (data: Service) => {
    try {
      const response = await api.post('/api/services', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao criar serviço');
      }
      throw new Error('Erro desconhecido ao criar serviço');
    }
  },

  deleteService: async (id: string) => {
    try {
      const response = await api.delete(`/api/services/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Erro ao deletar serviço');
      }
      throw new Error('Erro desconhecido ao deletar serviço');
    }
  },

  // Dúvidas
  getDuvidas: async () => {
    const response = await fetch('/api/duvidas');
    if (!response.ok) throw new Error('Erro ao buscar dúvidas');
    return response.json();
  }
};

// Tipos (mantenha os mesmos tipos que já existiam)
interface BudgetData {
  nome: string;
  email: string;
  telefone: string;
  nomeEmpresa: string;
  sedeEmpresa: string;
  equipamento: string;
  data: string;
  mensagem?: string;
}

export type Product = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string;
}

export type Service = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string;
  duration?: string;
}