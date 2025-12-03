import api from './api';

// Timeout utility
const withTimeout = (promise, timeout = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

export const geladeiraService = {
  // Alias para compatibilidade com componentes
  async getIngredientes() {
    return this.getGeladeira();
  },

  // Listar ingredientes da geladeira
  async getGeladeira() {
    try {
      console.log('[Geladeira] Buscando ingredientes...');
      
      const response = await withTimeout(api.get('/geladeira'));
      console.log('[Geladeira] Carregado:', response.data.length, 'itens');
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('[Geladeira] Erro:', error);
      
      let errorMessage = 'Erro ao carregar geladeira';
      
      if (error.message === 'Timeout') {
        errorMessage = 'Tempo de conexão excedido. Verifique sua internet.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: [] // Sempre retornar array para evitar erros
      };
    }
  },

  // Buscar ingredientes para autocomplete
  async searchIngredientes(query) {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }
      
      console.log('[Search] Buscando:', query);
      
      const response = await withTimeout(api.get(`/ingredientes/search?query=${encodeURIComponent(query)}`));
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('[Search] Erro:', error);
      
      // Em caso de erro na busca, retornar lista vazia
      return {
        success: false,
        error: 'Erro na busca de ingredientes',
        data: []
      };
    }
  },

  // Adicionar ingrediente à geladeira
  async addIngrediente(ingredienteData) {
    try {
      console.log('[Add] Adicionando:', ingredienteData);
      
      // Validação básica
      if (!ingredienteData?.ingrediente?.trim()) {
        return {
          success: false,
          error: 'Nome do ingrediente é obrigatório'
        };
      }
      
      const response = await withTimeout(
        api.post('/geladeira', {
          ...ingredienteData,
          ingrediente: ingredienteData.ingrediente.trim()
        })
      );
      
      console.log('[Add] Sucesso:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[Add] Erro:', error);
      
      let errorMessage = 'Erro ao adicionar ingrediente';
      
      if (error.message === 'Timeout') {
        errorMessage = 'Tempo de conexão excedido';
      } else if (error.response?.status === 404) {
        errorMessage = 'Ingrediente não encontrado. Use o autocomplete.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Este ingrediente já está na geladeira';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Atualizar ingrediente
  async updateIngrediente(id, updateData) {
    try {
      console.log('[Update] Atualizando:', { id, ...updateData });
      
      const response = await withTimeout(api.put(`/geladeira/${id}`, updateData));
      
      console.log('[Update] Sucesso:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[Update] Erro:', error);
      
      let errorMessage = 'Erro ao atualizar ingrediente';
      
      if (error.response?.status === 404) {
        errorMessage = 'Ingrediente não encontrado na geladeira';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Remover ingrediente
  async removeIngrediente(id) {
    try {
      console.log('[Delete] Removendo:', id);
      
      const response = await withTimeout(api.delete(`/geladeira/${id}`));
      
      console.log('[Delete] Sucesso:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[Delete] Erro:', error);
      
      let errorMessage = 'Erro ao remover ingrediente';
      
      if (error.response?.status === 404) {
        errorMessage = 'Ingrediente não encontrado na geladeira';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Lista de ingredientes básicos (com categorias)
  getIngredientesBasicos() {
    return [
      { nome: "Leite", categoria: "laticinios", icon: "local-drink" },
      { nome: "Ovos", categoria: "ovos", icon: "egg" },
      { nome: "Pão francês", categoria: "paes", icon: "bakery-dining" },
      { nome: "Arroz", categoria: "graos", icon: "rice-bowl" },
      { nome: "Feijão", categoria: "graos", icon: "restaurant" },
      { nome: "Café", categoria: "bebidas", icon: "coffee" },
      { nome: "Açúcar", categoria: "temperos", icon: "sugar" },
      { nome: "Sal", categoria: "temperos", icon: "seasoning" },
      { nome: "Óleo", categoria: "temperos", icon: "oil" },
      { nome: "Cebola", categoria: "hortifruti", icon: "emoji-food-beverage" },
      { nome: "Alho", categoria: "hortifruti", icon: "garlic" },
      { nome: "Tomate", categoria: "hortifruti", icon: "grocery" },
      { nome: "Batata", categoria: "hortifruti", icon: "potatoes" },
      { nome: "Banana", categoria: "hortifruti", icon: "apple" },
      { nome: "Maçã", categoria: "hortifruti", icon: "apple" },
    ];
  },

  // Listar categorias
  async getCategorias() {
    try {
      const response = await withTimeout(api.get('/categorias'));
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('[Categorias] Erro:', error);
      
      // Fallback: categorias padrão
      const defaultCategorias = [
        "Laticínios", "Ovos", "Carnes", "Peixes", "Frutas", 
        "Verduras", "Grãos", "Temperos", "Bebidas", "Outros"
      ];
      
      return { 
        success: false, 
        data: defaultCategorias 
      };
    }
  },

  // Estatísticas da geladeira
  async getEstatisticas() {
    try {
      const response = await withTimeout(api.get('/geladeira/estatisticas'));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[Estatisticas] Erro:', error);
      return {
        success: false,
        data: null
      };
    }
  }
};