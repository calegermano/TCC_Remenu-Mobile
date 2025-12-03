import api from './api';

export const geladeiraService = {
  // Listar ingredientes da geladeira
  async getGeladeira() {
    try {
      console.log('Buscando geladeira...');
      
      const response = await api.get('/geladeira');
      console.log('Geladeira carregada:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao carregar geladeira:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao carregar geladeira',
        data: {}
      };
    }
  },

  // Buscar ingredientes para autocomplete
  async searchIngredientes(query) {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }
      
      console.log('Buscando ingredientes:', query);
      
      const response = await api.get(`/ingredientes/search?query=${query}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro na busca:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erro na busca',
        data: []
      };
    }
  },

  // Adicionar ingrediente à geladeira
  async addIngrediente(ingredienteData) {
    try {
      console.log('Adicionando ingrediente:', ingredienteData);
      
      const response = await api.post('/geladeira', ingredienteData);
      
      console.log('Ingrediente adicionado:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      
      let errorMessage = 'Erro ao adicionar ingrediente';
      
      if (error.response?.status === 404) {
        errorMessage = 'Ingrediente não encontrado. Use o autocomplete.';
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
      console.log('Atualizando ingrediente:', { id, ...updateData });
      
      const response = await api.put(`/geladeira/${id}`, updateData);
      
      console.log('Ingrediente atualizado:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao atualizar ingrediente'
      };
    }
  },

  // Remover ingrediente
  async removeIngrediente(id) {
    try {
      console.log('Removendo ingrediente:', id);
      
      const response = await api.delete(`/geladeira/${id}`);
      
      console.log('Ingrediente removido:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao remover:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao remover ingrediente'
      };
    }
  },

  // Lista de ingredientes básicos (pode vir da API ou ser local)
  getIngredientesBasicos() {
    return [
      "Arroz branco", "Feijão carioca", "Feijão preto", "Macarrão", 
      "Óleo de soja", "Azeite de oliva", "Sal", "Açúcar", "Café", 
      "Leite integral", "Ovos", "Manteiga", "Farinha de trigo", 
      "Cebola", "Alho", "Tomate", "Batata inglesa", "Cenoura", 
      "Alface", "Limão", "Banana prata", "Maçã", "Pão francês"
    ];
  },

  // Listar categorias (se sua API tiver)
  async getCategorias() {
    try {
      const response = await api.get('/categorias');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return { success: false, data: [] };
    }
  }
};