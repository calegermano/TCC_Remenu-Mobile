import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EmptyState = ({ onAdd, isSearching }) => {
  if (isSearching) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="search-off" size={60} color="#e9ecef" />
        </View>
        <Text style={styles.title}>Nenhum item encontrado</Text>
        <Text style={styles.subtitle}>
          Tente usar outros termos de busca ou limpe os filtros
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="kitchen" size={60} color="#e9ecef" />
      </View>
      
      <Text style={styles.title}>Sua geladeira está vazia</Text>
      
      <Text style={styles.subtitle}>
        Adicione ingredientes para começar a organizar suas compras e evitar desperdícios
      </Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onAdd}
        >
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <Text style={styles.primaryButtonText}>Adicionar Primeiro Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <MaterialIcons name="playlist-add-check" size={24} color="#4a6fa5" />
          <Text style={styles.secondaryButtonText}>Importar Lista Básica</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Comece com:</Text>
        <View style={styles.tipsGrid}>
          {['Arroz e feijão', 'Ovos e leite', 'Pão e café', 'Frutas da estação'].map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <MaterialIcons name="check-circle" size={16} color="#28a745" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#4a6fa5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a6fa5',
    gap: 12,
  },
  secondaryButtonText: {
    color: '#4a6fa5',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#495057',
  },
});

export default EmptyState;