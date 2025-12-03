import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { geladeiraService } from '../../src/services/geladeiraService';

// Importações dos componentes
import BannerSection from '../../src/components/Geladeira/BannerSection';
import AddItemModal from '../../src/components/Geladeira/AddItemModal';
import SearchFilter from '../../src/components/Geladeira/SearchFilter';
import IngredienteItem from '../../src/components/Geladeira/IngredienteItem';
import EditItemModal from '../../src/components/Geladeira/EditItemModal';
import QuickAddCard from '../../src/components/Geladeira/QuickAddCard';
import TipsCard from '../../src/components/Geladeira/TipsCard';
import EmptyState from '../../src/components/Geladeira/EmptyState';
import LoadingScreen from '../../src/components/LoadingScreen';

// Definir tipos para os dados
type Ingrediente = {
  id: number;
  ingrediente: string;
  quantidade: number;
  validade: string | null;
  categoria?: string;
};

type GeladeiraData = {
  [categoria: string]: Ingrediente[];
};

type Stats = {
  total: number;
  expiring: number;
  expired: number;
};

type Filters = {
  categoria: string;
  sortBy: string;
  showExpired: boolean;
  showFresh: boolean;
};

export default function GeladeiraScreen() {
  const [geladeira, setGeladeira] = useState<GeladeiraData>({});
  const [filteredGeladeira, setFilteredGeladeira] = useState<GeladeiraData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Ingrediente | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    categoria: 'all',
    sortBy: 'name',
    showExpired: true,
    showFresh: true,
  });
  const [stats, setStats] = useState<Stats>({
    total: 0,
    expiring: 0,
    expired: 0,
  });

  // Carregar dados
  const loadGeladeira = async () => {
    try {
      setLoading(true);
      const result = await geladeiraService.getGeladeira();
      
      if (result.success) {
        setGeladeira(result.data);
        applyFilters(result.data, searchText, filters);
        calculateStats(result.data);
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível carregar');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Falha na conexão com o servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calcular estatísticas
  const calculateStats = (data: GeladeiraData) => {
    let total = 0;
    let expiring = 0;
    let expired = 0;
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    Object.values(data).forEach((categoria: Ingrediente[]) => {
      categoria.forEach((item: Ingrediente) => {
        total++;
        
        if (item.validade) {
          const validadeDate = new Date(item.validade);
          
          if (validadeDate < today) {
            expired++;
          } else if (validadeDate <= nextWeek) {
            expiring++;
          }
        }
      });
    });

    setStats({ total, expiring, expired });
  };

  // Aplicar filtros
  const applyFilters = (data: GeladeiraData, search: string, filterOptions: Filters) => {
    let filtered: GeladeiraData = { ...data };
    
    // Filtrar por busca
    if (search) {
      Object.keys(filtered).forEach(categoria => {
        if (filtered[categoria]) {
          filtered[categoria] = filtered[categoria].filter(item =>
            item.ingrediente.toLowerCase().includes(search.toLowerCase())
          );
        }
      });
    }
    
    // Filtrar por categoria
    if (filterOptions.categoria !== 'all') {
      Object.keys(filtered).forEach(categoria => {
        if (categoria.toLowerCase() !== filterOptions.categoria) {
          delete filtered[categoria];
        }
      });
    }
    
    // Filtrar por validade
    Object.keys(filtered).forEach(categoria => {
      if (filtered[categoria]) {
        filtered[categoria] = filtered[categoria].filter(item => {
          if (!item.validade) return true;
          
          const validadeDate = new Date(item.validade);
          const today = new Date();
          const isExpired = validadeDate < today;
          
          if (isExpired && !filterOptions.showExpired) return false;
          if (!isExpired && !filterOptions.showFresh) return false;
          
          return true;
        });
      }
    });
    
    // Ordenar
    Object.keys(filtered).forEach(categoria => {
      if (filtered[categoria]) {
        filtered[categoria].sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'date':
              if (!a.validade) return 1;
              if (!b.validade) return -1;
              return new Date(a.validade).getTime() - new Date(b.validade).getTime();
            case 'quantity':
              return b.quantidade - a.quantidade;
            default: // name
              return a.ingrediente.localeCompare(b.ingrediente);
          }
        });
      }
    });
    
    // Remover categorias vazias
    Object.keys(filtered).forEach(categoria => {
      if (!filtered[categoria] || filtered[categoria].length === 0) {
        delete filtered[categoria];
      }
    });
    
    setFilteredGeladeira(filtered);
  };

  // Handlers
  const handleSearch = (text: string) => {
    setSearchText(text);
    applyFilters(geladeira, text, filters);
  };

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    applyFilters(geladeira, searchText, newFilters);
  };

  const handleDelete = (item: Ingrediente) => {
    Alert.alert(
      'Remover Item',
      `Deseja remover "${item.ingrediente}" da geladeira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const result = await geladeiraService.removeIngrediente(item.id);
            if (result.success) {
              loadGeladeira();
            } else {
              Alert.alert('Erro', result.error);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadGeladeira();
  }, []);

  // Efeitos
  useEffect(() => {
    loadGeladeira();
  }, []);

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  const hasItems = Object.keys(filteredGeladeira).length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Geladeira</Text>
          <Text style={styles.headerSubtitle}>
            {stats.total} {stats.total === 1 ? 'item' : 'itens'} no total
          </Text>
        </View>
        
        <TouchableOpacity style={styles.statsButton}>
          <Feather name="bar-chart-2" size={24} color="#4a6fa5" />
          {stats.expired > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{stats.expired}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <BannerSection totalItems={stats.total} />
        
        {/* Estatísticas rápidas */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <MaterialIcons name="warning" size={24} color="#dc3545" />
            <View>
              <Text style={styles.statNumber}>{stats.expired}</Text>
              <Text style={styles.statLabel}>Vencidos</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="schedule" size={24} color="#ffc107" />
            <View>
              <Text style={styles.statNumber}>{stats.expiring}</Text>
              <Text style={styles.statLabel}>A vencer</Text>
            </View>
          </View>
        </View>

        {/* Busca e filtros */}
        <View style={styles.section}>
          <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        </View>

        {/* Ação rápida */}
        <View style={styles.section}>
          <QuickAddCard 
            onAdd={() => setShowAddModal(true)} 
            onSuccess={loadGeladeira}
          />
        </View>

        {/* Lista de ingredientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Na Geladeira</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{stats.total}</Text>
            </View>
          </View>

          {!hasItems ? (
            <EmptyState 
              onAdd={() => setShowAddModal(true)}
              isSearching={!!searchText}
            />
          ) : (
            <View style={styles.ingredientesList}>
              {Object.entries(filteredGeladeira).map(([categoria, itens]) => (
                <View key={categoria} style={styles.categoriaContainer}>
                  <Text style={styles.categoriaTitle}>{categoria}</Text>
                  {itens.map((item, index) => (
                    <IngredienteItem
                      key={`${item.id}-${index}`}
                      item={item}
                      onEdit={() => {
                        setSelectedItem(item);
                        setShowEditModal(true);
                      }}
                      onDelete={() => handleDelete(item)}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Dicas */}
        <View style={styles.section}>
          <TipsCard />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modais */}
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadGeladeira}
      />

      {selectedItem && (
        <EditItemModal
          visible={showEditModal}
          item={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSuccess={loadGeladeira}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  totalBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a6fa5',
  },
  ingredientesList: {
    gap: 16,
  },
  categoriaContainer: {
    gap: 12,
  },
  categoriaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  spacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4a6fa5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});