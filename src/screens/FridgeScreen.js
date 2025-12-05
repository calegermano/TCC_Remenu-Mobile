import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../services/api'; // Importando seu api.js corrigido

const BASIC_INGREDIENTS = [
    "Arroz branco", "Feijão carioca", "Feijão preto", "Macarrão", 
    "Óleo", "Sal", "Açúcar", "Café", "Leite", "Ovos", "Manteiga", 
    "Cebola", "Alho", "Tomate", "Batata", "Cenoura", "Alface"
];

export default function FridgeScreen() {
    // --- ESTADOS ---
    const [fridgeData, setFridgeData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Inputs Adicionar
    const [searchQuery, setSearchQuery] = useState('');
    const [quantity, setQuantity] = useState('');
    const [validade, setValidade] = useState(''); // Formato YYYY-MM-DD
    
    // Autocomplete
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Modal Editar
    const [modalVisible, setModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editQtd, setEditQtd] = useState('');
    const [editVal, setEditVal] = useState('');

    // --- 1. CARREGAR DADOS ---
    const fetchFridge = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/geladeira');
            const data = response.data;

            // Transforma Objeto Laravel {'Cat': [itens]} em Array React Native [{title: 'Cat', data: [itens]}]
            const sections = Object.keys(data).map(key => ({
                title: key,
                data: data[key]
            }));

            setFridgeData(sections);
        } catch (error) {
            console.error(error);
            // Se der 401 aqui, o interceptor do api.js ou o Login falharam
            if (error.response?.status === 401) {
                Alert.alert("Sessão Expirada", "Por favor, faça login novamente.");
            } else {
                Alert.alert("Erro", "Não foi possível carregar a geladeira.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFridge();
    }, [fetchFridge]);

    // --- 2. AUTOCOMPLETE ---
    const handleSearchInput = async (text) => {
        setSearchQuery(text);
        if (text.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const res = await api.get(`/ingredientes/search?query=${text}`);
            setSuggestions(res.data);
            setShowSuggestions(true);
        } catch (error) {
            console.log("Erro autocomplete", error);
        }
    };

    const selectSuggestion = (name) => {
        setSearchQuery(name);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    // --- 3. ADICIONAR ITEM ---
    const handleAddItem = async (nameOverride = null) => {
        const nome = nameOverride || searchQuery;
        const qtd = quantity || '1';

        if (!nome) return Alert.alert("Atenção", "Informe um ingrediente.");

        try {
            await api.post('/geladeira', {
                ingrediente: nome,
                quantidade: parseInt(qtd),
                validade: validade || null
            });
            
            // Limpar
            setSearchQuery('');
            setQuantity('');
            setValidade('');
            Alert.alert("Sucesso", "Item adicionado!");
            fetchFridge(); // Recarregar lista
        } catch (error) {
            const msg = error.response?.data?.erro || "Erro ao adicionar.";
            Alert.alert("Erro", msg);
        }
    };

    // --- 4. DELETAR ITEM ---
    const handleDelete = (id) => {
        Alert.alert("Remover", "Tem certeza?", [
            { text: "Cancelar" },
            { 
                text: "Sim", onPress: async () => {
                    try {
                        await api.delete(`/geladeira/${id}`);
                        fetchFridge();
                    } catch (e) { Alert.alert("Erro", "Falha ao remover."); }
                }
            }
        ]);
    };

    // --- 5. EDITAR ITEM (MODAL) ---
    const openEdit = (item) => {
        setEditItem(item);
        setEditQtd(String(item.quantidade));
        setEditVal(item.validade || '');
        setModalVisible(true);
    };

    const saveEdit = async () => {
        if (!editItem) return;
        try {
            await api.put(`/geladeira/${editItem.id}`, {
                quantidade: parseInt(editQtd),
                validade: editVal
            });
            setModalVisible(false);
            fetchFridge();
        } catch (error) {
            Alert.alert("Erro", "Falha ao atualizar.");
        }
    };

    // --- COMPONENTES VISUAIS ---

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.pageTitle}>Minha Geladeira</Text>
                <TouchableOpacity onPress={fetchFridge}>
                    <Ionicons name="reload" size={20} color="#D9682B" />
                </TouchableOpacity>
            </View>
            
            {/* CARD ADICIONAR */}
            <View style={styles.addCard}>
                <Text style={styles.cardTitle}>Adicionar Item</Text>
                
                {/* Input com Autocomplete */}
                <View style={{ zIndex: 10 }}> 
                    <Text style={styles.label}>Ingrediente</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Digite para buscar..."
                        value={searchQuery}
                        onChangeText={handleSearchInput}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <View style={styles.suggestionsBox}>
                            {suggestions.map(s => (
                                <TouchableOpacity 
                                    key={s.id} 
                                    style={styles.suggestionItem}
                                    onPress={() => selectSuggestion(s.nome)}
                                >
                                    <Text>{s.nome}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.row}>
                    <View style={[styles.col, { flex: 0.3 }]}>
                        <Text style={styles.label}>Qtd</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="numeric"
                            placeholder="1"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                    </View>
                    <View style={[styles.col, { flex: 0.65 }]}>
                        <Text style={styles.label}>Validade (AAAA-MM-DD)</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ex: 2025-12-30"
                            value={validade}
                            onChangeText={setValidade}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.btnAdd} onPress={() => handleAddItem()}>
                    <Text style={styles.btnAddText}>ADICIONAR À GELADEIRA</Text>
                </TouchableOpacity>
            </View>

            {/* BÁSICOS */}
            <View style={styles.basicsContainer}>
                <Text style={styles.sectionHeaderTitle}>Itens Básicos (Toque para adicionar)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
                    {BASIC_INGREDIENTS.map((item, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            style={styles.chip}
                            onPress={() => handleAddItem(item)}
                        >
                            <Text style={styles.chipText}>+ {item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    const renderItem = ({ item }) => {
        // Formatar data visualmente
        let dataFormatada = '—';
        let isVencido = false;
        if (item.validade) {
            const [ano, mes, dia] = item.validade.split('-');
            dataFormatada = `${dia}/${mes}/${ano}`;
            const dtVal = new Date(item.validade);
            if (dtVal < new Date()) isVencido = true;
        }

        return (
            <View style={styles.itemCard}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.ingrediente}</Text>
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemQtd}>Qtd: {item.quantidade}</Text>
                        <View style={styles.validadeBox}>
                            <Ionicons name="calendar-outline" size={12} color={isVencido ? '#D32F2F' : '#666'} />
                            <Text style={[styles.itemDate, isVencido && { color: '#D32F2F', fontWeight: 'bold' }]}>
                                {dataFormatada}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                        <Ionicons name="create-outline" size={22} color="#1976D2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                        <Ionicons name="trash-outline" size={22} color="#D32F2F" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={fridgeData}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitleText}>{title}</Text>
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={!loading && (
                    <View style={styles.emptyState}>
                        <Ionicons name="basket-outline" size={48} color="#CCC" />
                        <Text style={{ color: '#999', marginTop: 10 }}>Sua geladeira está vazia.</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#D9682B" />
                </View>
            )}

            {/* MODAL EDITAR */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.cardTitle}>Editar Item</Text>
                        
                        <Text style={styles.label}>Quantidade</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="numeric" 
                            value={editQtd} 
                            onChangeText={setEditQtd} 
                        />

                        <Text style={styles.label}>Validade</Text>
                        <TextInput 
                            style={styles.input} 
                            value={editVal} 
                            onChangeText={setEditVal} 
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}>
                                <Text style={{ color: '#666' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveEdit} style={styles.btnSave}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F4' },
    headerContainer: { padding: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#D9682B' },
    
    // Card Adicionar
    addCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, elevation: 3, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    label: { fontSize: 12, color: '#D9682B', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
    input: { 
        backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E0E0E0', 
        borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 16 
    },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { },
    btnAdd: { 
        backgroundColor: '#D9682B', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 
    },
    btnAddText: { color: '#FFF', fontWeight: 'bold' },

    // Autocomplete
    suggestionsBox: {
        position: 'absolute', top: 65, left: 0, right: 0,
        backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD',
        borderRadius: 8, zIndex: 100, maxHeight: 150
    },
    suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },

    // Básicos
    basicsContainer: { marginBottom: 10 },
    sectionHeaderTitle: { fontSize: 14, fontWeight: 'bold', color: '#666' },
    chip: {
        backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D9682B',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8
    },
    chipText: { color: '#D9682B', fontWeight: '600', fontSize: 12 },

    // Lista Items
    sectionHeader: { backgroundColor: '#EEE', paddingVertical: 6, paddingHorizontal: 20 },
    sectionTitleText: { fontSize: 12, fontWeight: 'bold', color: '#555', textTransform: 'uppercase' },
    itemCard: {
        flexDirection: 'row', backgroundColor: '#FFF', padding: 15,
        marginHorizontal: 15, marginTop: 8, borderRadius: 8, elevation: 1
    },
    itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
    itemMeta: { flexDirection: 'row', marginTop: 5, alignItems: 'center' },
    itemQtd: { fontSize: 12, backgroundColor: '#EEE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 10 },
    validadeBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    itemDate: { fontSize: 12, color: '#666' },
    actions: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 5, marginLeft: 10 },

    emptyState: { alignItems: 'center', padding: 40 },
    loader: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 12 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, gap: 15 },
    btnSave: { backgroundColor: '#D9682B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    btnCancel: { paddingVertical: 10 }
});