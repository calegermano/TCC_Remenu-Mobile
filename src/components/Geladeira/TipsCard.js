import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TipsCard = () => {
  const tips = [
    {
      icon: 'calendar-today',
      title: 'Validade',
      description: 'Sempre verifique a data de vencimento dos laticínios e organize por proximidade.',
    },
    {
      icon: 'ac-unit',
      title: 'Congelador',
      description: 'Carnes próximas do vencimento podem ser congeladas para uso posterior.',
    },
    {
      icon: 'restaurant',
      title: 'Planejamento',
      description: 'Use a aba "Planejamento" para criar receitas com itens que vão vencer.',
    },
    {
      icon: 'recycling',
      title: 'Sustentabilidade',
      description: 'Reaproveite sobras de alimentos em sopas, tortas e patês.',
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="lightbulb" size={24} color="#ffc107" />
        <Text style={styles.cardTitle}>Dicas Inteligentes</Text>
      </View>
      
      <Text style={styles.cardSubtitle}>
        Dicas para reduzir desperdício e economizar
      </Text>

      <View style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <MaterialIcons name={tip.icon} size={20} color="#ffc107" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <MaterialIcons name="info" size={16} color="#666" />
        <Text style={styles.footerText}>
          Dicas atualizadas diariamente com base nos seus hábitos
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffbf0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
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
    color: '#e6a700',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tipsContainer: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ffeaa7',
    gap: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default TipsCard;