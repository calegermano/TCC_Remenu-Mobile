import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { geladeiraService } from '../../services/geladeiraService';

const QuickAddCard = ({ onAdd, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickItems = [
    'Ovos', 'Leite', 'Pão francês', 'Arroz', 'Feijão',
    'Café', 'Açúcar', 'Óleo', 'Sal', 'Alho',
    'Cebola', 'Tomate', 'Batata', 'Cenoura', 'Maçã'
  ];

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddSelected = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um item');
      return;
    }

    setLoading(true);
    
    try {
      for (const item of selectedItems) {
        await geladeiraService.addIngrediente({
          ingrediente: item,
          quantidade: 1,
          validade: null,
        });
      }
      
      Alert.alert('Sucesso!', `${selectedItems.length} itens adicionados`);
      setSelectedItems([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar os itens');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustom = () => {
    if (onAdd) onAdd();
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="bolt" size={24} color="#4a6fa5" />
        <Text style={styles.cardTitle}>Adição Rápida</Text>
      </View>
      
      <Text style={styles.cardSubtitle}>
        Toque nos itens básicos para selecionar
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.itemsScroll}
      >
        <View style={styles.itemsContainer}>
          {quickItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.itemChip,
                selectedItems.includes(item) && styles.itemChipSelected
              ]}
              onPress={() => toggleItem(item)}
              disabled={loading}
            >
              <MaterialIcons
                name={selectedItems.includes(item) ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={selectedItems.includes(item) ? "#4a6fa5" : "#666"}
              />
              <Text style={[
                styles.itemText,
                selectedItems.includes(item) && styles.itemTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.addSelectedButton,
            (selectedItems.length === 0 || loading) && styles.buttonDisabled
          ]}
          onPress={handleAddSelected}
          disabled={selectedItems.length === 0 || loading}
        >
          <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
          <Text style={styles.addSelectedText}>
            Adicionar ({selectedItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleAddCustom}
          disabled={loading}
        >
          <Feather name="plus-circle" size={20} color="#4a6fa5" />
          <Text style={styles.customButtonText}>Personalizado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  itemsScroll: {
    marginBottom: 16,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  itemChipSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4a6fa5',
  },
  itemText: {
    fontSize: 14,
    color: '#666',
  },
  itemTextSelected: {
    color: '#4a6fa5',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addSelectedButton: {
    flex: 2,
    backgroundColor: '#4a6fa5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
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
    borderColor: '#4a6fa5',
    gap: 8,
  },
  customButtonText: {
    color: '#4a6fa5',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickAddCard;