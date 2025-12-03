import { Feather, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { geladeiraService } from '../../services/geladeiraService';
import AutoCompleteInput from '../AutoCompleteInput';

const AddItemModal = ({ visible, onClose, onSuccess }) => {
  const [ingrediente, setIngrediente] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [validade, setValidade] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!ingrediente.trim()) {
      Alert.alert('Atenção', 'Digite o nome do ingrediente');
      return;
    }

    if (!quantidade || parseInt(quantidade) < 1) {
      Alert.alert('Atenção', 'A quantidade deve ser pelo menos 1');
      return;
    }

    setLoading(true);
    
    const result = await geladeiraService.addIngrediente({
      ingrediente: ingrediente.trim(),
      quantidade: parseInt(quantidade),
      validade: validade ? validade.toISOString().split('T')[0] : null,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso!', 'Ingrediente adicionado à geladeira');
      resetForm();
      onSuccess();
      onClose();
    } else {
      Alert.alert('Erro', result.error || 'Não foi possível adicionar');
    }
  };

  const resetForm = () => {
    setIngrediente('');
    setQuantidade('1');
    setValidade(null);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValidade(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Selecionar data';
    return date.toLocaleDateString('pt-BR');
  };

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
            <Text style={styles.modalTitle}>Adicionar Ingrediente</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Campo Ingrediente com Autocomplete */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ingrediente *</Text>
              <AutoCompleteInput
                value={ingrediente}
                onChangeText={setIngrediente}
                onSelect={setIngrediente}
                placeholder="Digite para buscar..."
              />
            </View>

            {/* Quantidade */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantidade *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={quantidade}
                  onChangeText={setQuantidade}
                  placeholder="Ex: 1"
                  keyboardType="numeric"
                />
                <Text style={styles.inputHelper}>unidade(s)</Text>
              </View>
            </View>

            {/* Validade */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Validade (opcional)</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialIcons name="calendar-today" size={20} color="#666" />
                <Text style={styles.dateButtonText}>
                  {formatDate(validade)}
                </Text>
                <Feather name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
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

            {/* Dicas rápidas */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Adicionar rápido:</Text>
              <View style={styles.quickAddGrid}>
                {['Ovos', 'Leite', 'Pão', 'Arroz'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.quickAddButton}
                    onPress={() => setIngrediente(item)}
                  >
                    <Text style={styles.quickAddText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="plus" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Adicione TextInput aqui no mesmo arquivo
import { TextInput } from 'react-native';

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
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginRight: 12,
  },
  inputHelper: {
    fontSize: 14,
    color: '#6c757d',
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
  tipsContainer: {
    marginTop: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAddButton: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cfe2ff',
  },
  quickAddText: {
    color: '#4a6fa5',
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
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
  addButton: {
    flex: 1,
    backgroundColor: '#4a6fa5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddItemModal;