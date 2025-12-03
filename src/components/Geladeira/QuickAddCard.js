import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { geladeiraService } from '../../services/geladeiraService';

const QuickAddCard = ({ onAdd, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickItems, setQuickItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Carregar itens rápidos do service
  useEffect(() => {
    loadQuickItems();
  }, []);

  const loadQuickItems = () => {
    try {
      setLoadingItems(true);
      const items = geladeiraService.getIngredientesBasicos();
      setQuickItems(items);
    } catch (error) {
      console.error('Erro ao carregar itens rápidos:', error);
      // Fallback para lista padrão
      setQuickItems([
        { nome: "Ovos", categoria: "ovos", icon: "egg" },
        { nome: "Leite", categoria: "laticinios", icon: "local-drink" },
        { nome: "Pão francês", categoria: "paes", icon: "bakery-dining" },
        { nome: "Arroz", categoria: "graos", icon: "rice-bowl" },
        { nome: "Feijão", categoria: "graos", icon: "restaurant" },
        { nome: "Café", categoria: "bebidas", icon: "coffee" },
        { nome: "Açúcar", categoria: "temperos", icon: "sugar" },
        { nome: "Óleo", categoria: "temperos", icon: "oil" },
        { nome: "Sal", categoria: "temperos", icon: "seasoning" },
        { nome: "Alho", categoria: "hortifruti", icon: "garlic" },
        { nome: "Cebola", categoria: "hortifruti", icon: "emoji-food-beverage" },
        { nome: "Tomate", categoria: "hortifruti", icon: "grocery" },
        { nome: "Batata", categoria: "hortifruti", icon: "potatoes" },
        { nome: "Cenoura", categoria: "hortifruti", icon: "carrot" },
        { nome: "Maçã", categoria: "hortifruti", icon: "apple" },
      ]);
    } finally {
      setLoadingItems(false);
    }
  };

  const toggleItem = (item) => {
    const itemNome = typeof item === 'string' ? item : item.nome;
    
    if (selectedItems.includes(itemNome)) {
      setSelectedItems(selectedItems.filter(i => i !== itemNome));
    } else {
      setSelectedItems([...selectedItems, itemNome]);
    }
  };

  const isItemSelected = (item) => {
    const itemNome = typeof item === 'string' ? item : item.nome;
    return selectedItems.includes(itemNome);
  };

  const handleAddSelected = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um item');
      return;
    }

    setLoading(true);
    
    try {
      let addedCount = 0;
      let errors = [];

      for (const itemNome of selectedItems) {
        try {
          const result = await geladeiraService.addIngrediente({
            ingrediente: itemNome,
            quantidade: 1,
            validade: null,
          });

          if (result.success) {
            addedCount++;
          } else {
            errors.push(`${itemNome}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`${itemNome}: Erro na conexão`);
        }
      }

      // Mostrar resultado
      if (errors.length === 0) {
        Alert.alert(
          'Sucesso!', 
          `${addedCount} item${addedCount !== 1 ? 'ns' : ''} adicionado${addedCount !== 1 ? 's' : ''} à geladeira`,
          [{ text: 'OK', onPress: () => {
            setSelectedItems([]);
            if (onSuccess) onSuccess();
          }}]
        );
      } else if (addedCount > 0) {
        Alert.alert(
          'Atenção', 
          `${addedCount} item${addedCount !== 1 ? 'ns' : ''} adicionado${addedCount !== 1 ? 's' : ''}, ${errors.length} falha${errors.length !== 1 ? 's' : ''}:\n${errors.join('\n')}`,
          [{ text: 'OK', onPress: () => {
            setSelectedItems([]);
            if (onSuccess) onSuccess();
          }}]
        );
      } else {
        Alert.alert(
          'Erro', 
          `Nenhum item foi adicionado:\n${errors.join('\n')}`
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar os itens');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustom = () => {
    if (onAdd) onAdd();
  };

  const getItemIcon = (item) => {
    if (typeof item === 'string') {
      // Mapeamento simples para ícones padrão
      const iconMap = {
        'Ovos': 'egg',
        'Leite': 'local-drink',
        'Pão francês': 'bakery-dining',
        'Arroz': 'rice-bowl',
        'Feijão': 'restaurant',
        'Café': 'coffee',
        'Açúcar': 'sugar',
        'Óleo': 'oil',
        'Sal': 'seasoning',
        'Alho': 'garlic',
        'Cebola': 'emoji-food-beverage',
        'Tomate': 'grocery',
        'Batata': 'potatoes',
        'Cenoura': 'carrot',
        'Maçã': 'apple',
      };
      return iconMap[item] || 'fast-food';
    }
    return item.icon || 'fast-food';
  };

  const renderItemContent = (item) => {
    const itemNome = typeof item === 'string' ? item : item.nome;
    const isSelected = isItemSelected(item);
    const iconName = getItemIcon(item);

    return (
      <TouchableOpacity
        key={itemNome}
        style={[
          styles.itemChip,
          isSelected && styles.itemChipSelected
        ]}
        onPress={() => toggleItem(item)}
        disabled={loading}
      >
        {/* Ícone do ingrediente */}
        <View style={[
          styles.itemIconContainer,
          isSelected && styles.itemIconContainerSelected
        ]}>
          <MaterialIcons
            name={iconName}
            size={16}
            color={isSelected ? "#fff" : "#4a6fa5"}
          />
        </View>

        {/* Checkbox */}
        <MaterialIcons
          name={isSelected ? "check-box" : "check-box-outline-blank"}
          size={20}
          color={isSelected ? "#4a6fa5" : "#666"}
        />

        {/* Nome do ingrediente */}
        <Text style={[
          styles.itemText,
          isSelected && styles.itemTextSelected
        ]} numberOfLines={1}>
          {itemNome}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
      {/* Cabeçalho */}
      <View style={styles.cardHeader}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="bolt" size={24} color="#D9682B" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.cardTitle}>Adição Rápida</Text>
          <Text style={styles.cardSubtitle}>
            Toque nos itens básicos para selecionar
          </Text>
        </View>
      </View>

      {/* Lista de itens */}
      {loadingItems ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#D9682B" />
          <Text style={styles.loadingText}>Carregando itens...</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.itemsScroll}
            contentContainerStyle={styles.itemsScrollContent}
          >
            <View style={styles.itemsContainer}>
              {quickItems.map((item) => renderItemContent(item))}
            </View>
          </ScrollView>

          {/* Contador de selecionados */}
          {selectedItems.length > 0 && (
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {selectedItems.length} item{selectedItems.length !== 1 ? 'ns' : ''} selecionado{selectedItems.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {/* Botões de ação */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.addSelectedButton,
                (selectedItems.length === 0 || loading) && styles.buttonDisabled
              ]}
              onPress={handleAddSelected}
              disabled={selectedItems.length === 0 || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
                  <Text style={styles.addSelectedText}>
                    Adicionar ({selectedItems.length})
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.customButton}
              onPress={handleAddCustom}
              disabled={loading}
            >
              <Feather name="plus-circle" size={20} color="#D9682B" />
              <Text style={styles.customButtonText}>Personalizado</Text>
            </TouchableOpacity>
          </View>

          {/* Dica */}
          <View style={styles.tipContainer}>
            <MaterialIcons name="lightbulb" size={16} color="#FFA726" />
            <Text style={styles.tipText}>
              Mantenha pressionado para selecionar múltiplos itens rapidamente
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217, 104, 43, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  itemsScroll: {
    marginBottom: 12,
  },
  itemsScrollContent: {
    paddingRight: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
    minWidth: 140,
  },
  itemChipSelected: {
    backgroundColor: 'rgba(217, 104, 43, 0.08)',
    borderColor: '#D9682B',
  },
  itemIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(217, 104, 43, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconContainerSelected: {
    backgroundColor: '#D9682B',
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemTextSelected: {
    color: '#D9682B',
    fontWeight: '600',
  },
  selectionInfo: {
    backgroundColor: 'rgba(217, 104, 43, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#D9682B',
  },
  selectionText: {
    fontSize: 14,
    color: '#D9682B',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addSelectedButton: {
    flex: 2,
    backgroundColor: '#D9682B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addSelectedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  customButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D9682B',
    gap: 8,
    backgroundColor: '#fff',
  },
  customButtonText: {
    color: '#D9682B',
    fontSize: 16,
    fontWeight: '600',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 167, 38, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 167, 38, 0.2)',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#FFA726',
    fontStyle: 'italic',
  },
});

export default QuickAddCard;