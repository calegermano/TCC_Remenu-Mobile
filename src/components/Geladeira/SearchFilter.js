import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    categoria: 'all',
    sortBy: 'name',
    showExpired: true,
    showFresh: true,
  });

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const categorias = [
    'Todos',
    'Frutas',
    'Verduras',
    'Laticínios',
    'Carnes',
    'Grãos',
    'Temperos',
    'Outros'
  ];

  return (
    <>
      <View style={styles.container}>
        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar na geladeira..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Botão de filtro */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="#4a6fa5" />
        </TouchableOpacity>
      </View>

      {/* Modal de filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar Itens</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Categoria */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Categoria</Text>
                <View style={styles.categoriesContainer}>
                  {categorias.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        filters.categoria === cat.toLowerCase() && 
                        styles.categoryButtonActive
                      ]}
                      onPress={() => handleFilterChange('categoria', cat.toLowerCase())}
                    >
                      <Text style={[
                        styles.categoryText,
                        filters.categoria === cat.toLowerCase() && 
                        styles.categoryTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ordenação */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Ordenar por</Text>
                {[
                  { id: 'name', label: 'Nome (A-Z)' },
                  { id: 'date', label: 'Validade (próxima)' },
                  { id: 'quantity', label: 'Quantidade' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionButton}
                    onPress={() => handleFilterChange('sortBy', option.id)}
                  >
                    <MaterialIcons
                      name={filters.sortBy === option.id ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color="#4a6fa5"
                    />
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mostrar/Esconder */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Mostrar</Text>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Itens vencidos</Text>
                  <Switch
                    value={filters.showExpired}
                    onValueChange={(value) => handleFilterChange('showExpired', value)}
                    trackColor={{ false: '#e9ecef', true: '#4a6fa5' }}
                    thumbColor="#fff"
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Itens dentro da validade</Text>
                  <Switch
                    value={filters.showFresh}
                    onValueChange={(value) => handleFilterChange('showFresh', value)}
                    trackColor={{ false: '#e9ecef', true: '#4a6fa5' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setFilters({
                    categoria: 'all',
                    sortBy: 'name',
                    showExpired: true,
                    showFresh: true,
                  });
                  onFilter({
                    categoria: 'all',
                    sortBy: 'name',
                    showExpired: true,
                    showFresh: true,
                  });
                }}
              >
                <Text style={styles.resetButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryButtonActive: {
    backgroundColor: '#4a6fa5',
    borderColor: '#4a6fa5',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4a6fa5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchFilter;