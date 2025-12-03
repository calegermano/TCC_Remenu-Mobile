import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const IngredienteItem = ({ item, onEdit, onDelete }) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  
  const { ingrediente, quantidade, validade } = item;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getValidadeStatus = () => {
    if (!validade) return { label: 'Sem validade', color: '#666', icon: 'calendar-blank' };
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataValidade = new Date(validade);
    dataValidade.setHours(0, 0, 0, 0);
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        label: 'VENCIDO', 
        color: '#dc3545', 
        icon: 'warning',
        urgency: 'high'
      };
    } else if (diffDays === 0) {
      return { 
        label: 'HOJE', 
        color: '#dc3545', 
        icon: 'warning',
        urgency: 'high'
      };
    } else if (diffDays <= 1) {
      return { 
        label: `AMANHÃ`, 
        color: '#ffc107', 
        icon: 'schedule',
        urgency: 'medium'
      };
    } else if (diffDays <= 7) {
      return { 
        label: `EM ${diffDays} DIAS`, 
        color: '#28a745', 
        icon: 'calendar-today',
        urgency: 'low'
      };
    } else {
      return { 
        label: formatDate(validade), 
        color: '#6c757d', 
        icon: 'calendar-today',
        urgency: 'none'
      };
    }
  };

  const validadeStatus = getValidadeStatus();

  const handlePress = () => {
    // Animação de toque
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipeActions}>
        <Animated.View style={[styles.swipeAction, styles.editAction, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.swipeButton}
            onPress={() => {
              onEdit(item);
            }}
          >
            <Feather name="edit-2" size={24} color="#fff" />
            <Text style={styles.swipeButtonText}>Editar</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.swipeAction, styles.deleteAction, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.swipeButton}
            onPress={() => {
              onDelete(item);
            }}
          >
            <Feather name="trash-2" size={24} color="#fff" />
            <Text style={styles.swipeButtonText}>Excluir</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipeActions}>
        <Animated.View style={[styles.swipeAction, styles.infoAction, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.swipeButton}
            onPress={() => {
              // Ação de info/detalhes
            }}
          >
            <Feather name="info" size={24} color="#fff" />
            <Text style={styles.swipeButtonText}>Detalhes</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <Animated.View 
        style={[
          styles.container,
          validadeStatus.urgency === 'high' && styles.containerExpired,
          validadeStatus.urgency === 'medium' && styles.containerWarning,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        {/* Indicador de urgência */}
        {validadeStatus.urgency === 'high' && (
          <View style={styles.urgencyIndicator} />
        )}
        
        <View style={styles.content}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.nome} numberOfLines={1}>
                {ingrediente}
              </Text>
              
              {validadeStatus.urgency === 'high' && (
                <View style={styles.expiredBadge}>
                  <MaterialIcons name="warning" size={14} color="#fff" />
                  <Text style={styles.expiredText}>URGENTE</Text>
                </View>
              )}
            </View>
            
            <View style={styles.quantityBadge}>
              <MaterialIcons name="layers" size={16} color="#4a6fa5" />
              <Text style={styles.quantityText}>{quantidade}</Text>
            </View>
          </View>

          {/* Detalhes */}
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MaterialIcons 
                name={validadeStatus.icon} 
                size={16} 
                color={validadeStatus.color} 
              />
              <Text style={[styles.detailText, { color: validadeStatus.color }]}>
                {validadeStatus.label}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Feather name="package" size={16} color="#666" />
              <Text style={styles.detailText}>
                {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
              </Text>
            </View>
          </View>

          {/* Data completa (se houver) */}
          {validade && validadeStatus.urgency !== 'none' && (
            <Text style={styles.fullDate}>
              Validade: {formatDate(validade)}
            </Text>
          )}

          {/* Ações rápidas */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => onEdit(item)}
            >
              <Feather name="edit-2" size={18} color="#4a6fa5" />
              <Text style={styles.quickActionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => onDelete(item)}
            >
              <Feather name="trash-2" size={18} color="#dc3545" />
              <Text style={[styles.quickActionText, { color: '#dc3545' }]}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ícone de arrastar */}
        <View style={styles.dragHandle}>
          <MaterialIcons name="drag-handle" size={20} color="#dee2e6" />
        </View>
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerExpired: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  containerWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    backgroundColor: '#fffbf0',
  },
  urgencyIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#dc3545',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  expiredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a6fa5',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  fullDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 14,
    color: '#4a6fa5',
    fontWeight: '500',
  },
  dragHandle: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#e9ecef',
  },
  swipeActions: {
    flexDirection: 'row',
    width: 200,
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
  },
  editAction: {
    backgroundColor: '#4a6fa5',
  },
  deleteAction: {
    backgroundColor: '#dc3545',
  },
  infoAction: {
    backgroundColor: '#6c757d',
  },
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  swipeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default IngredienteItem;