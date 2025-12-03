import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { geladeiraService } from '../services/geladeiraService';

// Componentes
import BannerSection from '../components/Geladeira/BannerSection';
import SearchFilter from '../components/Geladeira/SearchFilter';
import IngredienteItem from '../components/Geladeira/IngredienteItem';
import QuickAddCard from '../components/Geladeira/QuickAddCard';
import TipsCard from '../components/Geladeira/TipsCard';
import EmptyState from '../components/Geladeira/EmptyState';
import AddItemModal from '../components/Geladeira/AddItemModal';
import EditItemModal from '../components/Geladeira/EditItemModal';

export default function FridgeScreen() {
  // Estados
  const [ingredientes, setIngredientes] = useState([]);
  const [filteredIngredientes, setFilteredIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    categoria: 'all',
    sortBy: 'name',
    showExpired: true,
    showFresh: true,
  });
  
  // Modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Carregar dados
  const carregarIngredientes = useCallback(async () => {
    try {
      const result = await geladeiraService.getIngredientes();
      if (result.success) {
        setIngredientes(result.data);
        aplicarFiltros(result.data, searchText, filters);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os ingredientes');
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      Alert.alert('Erro', 'Falha na conexão');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchText, filters]);

  // Carregar inicial
  useEffect(() => {
    carregarIngredientes();
  }, []);

  // Aplicar filtros e busca
  const aplicarFiltros = (data, search, filterOptions) => {
    let filtered = [...data];

    // Filtro de busca
    if (search) {
      filtered = filtered.filter(item =>
        item.ingrediente.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro de categoria
    if (filterOptions.categoria !== 'all') {
      filtered = filtered.filter(item =>
        item.categoria === filterOptions.categoria
      );
    }

    // Filtro de validade
    if (!filterOptions.showExpired || !filterOptions.showFresh) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      filtered = filtered.filter(item => {
        if (!item.validade) return true;
        
        const dataValidade = new Date(item.validade);
        dataValidade.setHours(0, 0, 0, 0);
        const diffTime = dataValidade - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const isExpired = diffDays < 0;
        
        if (!filterOptions.showExpired && isExpired) return false;
        if (!filterOptions.showFresh && !isExpired) return true;
        return true;
      });
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'date':
          if (!a.validade && !b.validade) return 0;
          if (!a.validade) return 1;
          if (!b.validade) return -1;
          return new Date(a.validade) - new Date(b.validade);
        
        case 'quantity':
          return b.quantidade - a.quantidade;
        
        default: // 'name'
          return a.ingrediente.localeCompare(b.ingrediente);
      }
    });

    setFilteredIngredientes(filtered);
  };

  // Handlers
  const handleSearch = (text) => {
    setSearchText(text);
    aplicarFiltros(ingredientes, text, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    aplicarFiltros(ingredientes, searchText, newFilters);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    carregarIngredientes();
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Remover Ingrediente',
      `Deseja remover "${item.ingrediente}" da geladeira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const result = await geladeiraService.removeIngrediente(item.id);
            if (result.success) {
              carregarIngredientes();
              Alert.alert('Sucesso!', 'Ingrediente removido');
            } else {
              Alert.alert('Erro', 'Não foi possível remover');
            }
          },
        },
      ]
    );
  };

  const handleAddSuccess = () => {
    carregarIngredientes();
    setShowAddModal(false);
  };

  const handleEditSuccess = () => {
    carregarIngredientes();
    setShowEditModal(false);
    setSelectedItem(null);
  };

  // Renderização
  const renderItem = ({ item }) => (
    <IngredienteItem
      item={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a6fa5" />
        <Text style={styles.loadingText}>Carregando sua geladeira...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Geladeira</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Feather name="plus" size={24} color="#4a6fa5" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <FlatList
        data={filteredIngredientes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <BannerSection totalItems={ingredientes.length} />
            
            {/* Busca e Filtros */}
            <SearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            
            {/* Card de adição rápida */}
            {ingredientes.length === 0 && (
              <QuickAddCard
                onAdd={() => setShowAddModal(true)}
                onSuccess={carregarIngredientes}
              />
            )}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            onAdd={() => setShowAddModal(true)}
            isSearching={searchText !== '' || Object.values(filters).some(f => f !== 'all')}
          />
        }
        ListFooterComponent={
          <>
            {/* Dicas (mostrar apenas se tiver itens) */}
            {ingredientes.length > 0 && <TipsCard />}
            
            {/* Estatísticas */}
            {ingredientes.length > 0 && (
              <View style={styles.statsFooter}>
                <Text style={styles.statsText}>
                  {filteredIngredientes.length} de {ingredientes.length} itens
                </Text>
              </View>
            )}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4a6fa5']}
            tintColor="#4a6fa5"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modais */}
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
      
      <EditItemModal
        visible={showEditModal}
        item={selectedItem}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#D9682B',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.2)',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  statsFooter: {
    padding: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});