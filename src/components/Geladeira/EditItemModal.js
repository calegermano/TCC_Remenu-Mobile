import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { geladeiraService } from '../../services/geladeiraService';

const EditItemModal = ({ visible, item, onClose, onSuccess }) => {
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantidade(item.quantidade?.toString() || '1');
      setValidade(item.validade ? new Date(item.validade) : null);
    }
  }, [item]);

  const handleSave = async () => {
    if (!quantidade || parseInt(quantidade) < 1) {
      Alert.alert('Atenção', 'A quantidade deve ser pelo menos 1');
      return;
    }

    if (!item) {
      Alert.alert('Erro', 'Item não encontrado');
      return;
    }

    setLoading(true);

    const updateData = {};
    
    if (quantidade !== item.quantidade?.toString()) {
      updateData.quantidade = parseInt(quantidade);
    }
    
    if (validade !== (item.validade ? new Date(item.validade) : null)) {
      updateData.validade = validade ? validade.toISOString().split('T')[0] : null;
    }

    // Se não houve mudanças
    if (Object.keys(updateData).length === 0) {
      Alert.alert('Atenção', 'Nenhuma alteração foi feita');
      setLoading(false);
      return;
    }

    const result = await geladeiraService.updateIngrediente(item.id, updateData);
    
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso!', 'Item atualizado com sucesso');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      Alert.alert('Erro', result.error || 'Não foi possível atualizar');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja remover "${item?.ingrediente}" permanentemente da geladeira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const result = await geladeiraService.removeIngrediente(item.id);
            setLoading(false);
            
            if (result.success) {
              Alert.alert('Sucesso!', 'Item removido com sucesso');
              if (onSuccess) onSuccess();
              onClose();
            } else {
              Alert.alert('Erro', result.error || 'Não foi possível remover');
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValidade(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Não definida';
    return date.toLocaleDateString('pt-BR');
  };

  const getValidadeStatus = () => {
    if (!validade) return { label: 'Sem validade', color: '#666' };
    
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'VENCIDO', color: '#dc3545' };
    } else if (diffDays <= 3) {
      return { label: `Vence em ${diffDays} dia${diffDays !== 1 ? 's' : ''}`, color: '#ffc107' };
    } else if (diffDays <= 7) {
      return { label: `Vence em ${diffDays} dias`, color: '#28a745' };
    } else {
      return { label: `Vence em ${diffDays} dias`, color: '#6c757d' };
    }
  };

  const validadeStatus = getValidadeStatus();

  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Editar Item</Text>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.ingrediente}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Informações atuais */}
            <View style={styles.currentInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Quantidade atual:</Text>
                <Text style={styles.infoValue}>{item.quantidade}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Validade atual:</Text>
                <View style={styles.validadeContainer}>
                  <Text style={styles.infoValue}>
                    {item.validade ? formatDate(new Date(item.validade)) : 'Não definida'}
                  </Text>
                  <View style={[styles.validadeBadge, { backgroundColor: validadeStatus.color + '20' }]}>
                    <Text style={[styles.validadeBadgeText, { color: validadeStatus.color }]}>
                      {validadeStatus.label}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Formulário de edição */}
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nova Quantidade *</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      const qtd = parseInt(quantidade) - 1;
                      if (qtd >= 1) setQuantidade(qtd.toString());
                    }}
                    disabled={loading}
                  >
                    <Feather name="minus" size={20} color="#4a6fa5" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.quantityInput}
                    value={quantidade}
                    onChangeText={setQuantidade}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantidade((parseInt(quantidade) + 1).toString())}
                    disabled={loading}
                  >
                    <Feather name="plus" size={20} color="#4a6fa5" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nova Validade (opcional)</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                  disabled={loading}
                >
                  <MaterialIcons 
                    name={validade ? "calendar-today" : "calendar-blank"} 
                    size={20} 
                    color="#666" 
                  />
                  <Text style={styles.dateButtonText}>
                    {validade ? formatDate(validade) : 'Definir validade'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                
                {validade && (
                  <TouchableOpacity
                    style={styles.removeDateButton}
                    onPress={() => setValidade(null)}
                    disabled={loading}
                  >
                    <Feather name="x-circle" size={16} color="#dc3545" />
                    <Text style={styles.removeDateText}>Remover validade</Text>
                  </TouchableOpacity>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={validade || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </ScrollView>

          {/* Footer com ações */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={loading}
            >
              <Feather name="trash-2" size={20} color="#dc3545" />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                <Feather name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  currentInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  validadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  validadeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validadeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  removeDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 8,
  },
  removeDateText: {
    fontSize: 14,
    color: '#dc3545',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
    gap: 8,
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4a6fa5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditItemModal;