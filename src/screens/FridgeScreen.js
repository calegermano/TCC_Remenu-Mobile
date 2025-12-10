    import { Ionicons } from '@expo/vector-icons';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import { useCallback, useEffect, useState } from 'react';
    import {
        ActivityIndicator,
        Alert,
        KeyboardAvoidingView,
        Modal,
        Platform,
        ScrollView,
        SectionList,
        StyleSheet,
        Text,
        TextInput,
        TouchableOpacity,
        View
    } from 'react-native';
    import api from '../services/api';

    const BASIC_INGREDIENTS = [
        'Carne moída bovina', 'Acém', 'Patinho', 'Peito de frango', 'Coxa de frango', 
        'Frango inteiro', 'Linguiça calabresa', 'Bacon', 'Ovo de galinha branco',
        'Arroz branco', 'Arroz integral', 'Feijão carioca', 'Feijão preto', 
        'Milho para pipoca', 'Aveia em flocos', 'Alho', 'Cebola branca', 'Cebola roxa', 
        'Tomate', 'Batata inglesa', 'Cenoura', 'Alface americana', 'Couve-manteiga', 
        'Pimentão verde', 'Abobrinha italiana', 'Salsinha', 'Cebolinha', 'Limão tahiti',
        'Banana prata', 'Maçã gala', 'Laranja pera', 'Mamão papaia', 'Leite integral', 
        'Manteiga com sal', 'Requeijão tradicional', 'Creme de leite UHT', 'Leite condensado', 
        'Queijo mussarela', 'Queijo parmesão nacional', 'Farinha de trigo tradicional', 
        'Farinha de mandioca torrada', 'Fubá mimoso', 'Amido de milho', 'Massa de espaguete nº 8', 
        'Massa de fusilli', 'Pão francês', 'Pão de forma branco', 'Sal refinado', 
        'Açúcar refinado', 'Pimenta-do-reino moída', 'Orégano seco', 'Louro seco', 
        'Fermento químico em pó', 'Molho de tomate tradicional', 'Maionese tradicional', 
        'Ketchup tradicional', 'Mostarda amarela', 'Molho de soja (shoyu tradicional)', 
        'Vinagre de vinho branco', 'Óleo de soja', 'Óleo de oliva extravirgem'
    ];

    export default function FridgeScreen() {
        const [fridgeData, setFridgeData] = useState([]);
        const [loading, setLoading] = useState(false);
        
        // Inputs e Estados
        const [searchQuery, setSearchQuery] = useState('');
        const [quantity, setQuantity] = useState('');
        const [validade, setValidade] = useState(''); 
        
        const [suggestions, setSuggestions] = useState([]);
        const [showSuggestions, setShowSuggestions] = useState(false);

        const [modalVisible, setModalVisible] = useState(false); 
        const [showAddModal, setShowAddModal] = useState(false); 
        
        const [editItem, setEditItem] = useState(null);
        const [editQtd, setEditQtd] = useState('');
        const [editVal, setEditVal] = useState(''); 
        
        const [date, setDate] = useState(new Date()); 
        const [showPicker, setShowPicker] = useState(false); 
        const [pickerMode, setPickerMode] = useState('add'); 

        // --- MÁSCARA E DATA ---
        const handleDateMask = (text, type) => {
            let cleaned = text.replace(/\D/g, '');
            if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);
            let formatted = cleaned;
            if (cleaned.length >= 5) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
            else if (cleaned.length >= 3) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;

            if (type === 'add') setValidade(formatted);
            else setEditVal(formatted);
        };

        const formatDateForDB = (dateString) => {
            if (!dateString || dateString.length !== 10) return null;
            const [day, month, year] = dateString.split('/');
            return `${year}-${month}-${day}`;
        };

        const formatDateFromDB = (dateString) => {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        };

        // --- CARREGAR DADOS ---
        const fetchFridge = useCallback(async () => {
            setLoading(true);
            try {
                const response = await api.get('/app/geladeira'); 
                const data = response.data;
                if (!data || typeof data !== 'object' || data.message) return;
                const sections = Object.keys(data).map(key => ({ title: key, data: data[key] }));
                setFridgeData(sections);
            } catch (error) {
                console.log("Erro fetch:", error);
            } finally {
                setLoading(false);
            }
        }, []);

        useEffect(() => { fetchFridge(); }, [fetchFridge]);

        // --- AUTOCOMPLETE CORRIGIDO ---
        const handleSearchInput = async (text) => {
            setSearchQuery(text);
            
            if (text.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                console.log("Buscando ingrediente:", text);
                
                // MUDANÇA AQUI: Adicionamos o segundo parâmetro com headers
                // Authorization: '' sobrescreve o padrão e envia SEM token
                const res = await api.get(`/app/ingredientes/search?query=${text}`, {
                    headers: { Authorization: '' } 
                });
                
                console.log("Sugestões encontradas:", res.data.length);

                if(res.data && res.data.length > 0) {
                    setSuggestions(res.data);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.log("Erro no autocomplete:", error);
            }
        };

        const selectSuggestion = (name) => {
            setSearchQuery(name);
            setShowSuggestions(false);
            setSuggestions([]);
            // Opcional: Esconder teclado ao selecionar
        };

        // --- PICKER E AÇÕES ---
        const onPickerChange = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowPicker(Platform.OS === 'ios'); 
            setDate(currentDate);

            if (event.type === "set" || Platform.OS === 'ios') {
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const year = currentDate.getFullYear();
                const formatted = `${day}/${month}/${year}`;

                if (pickerMode === 'add') setValidade(formatted);
                else setEditVal(formatted);
                if (Platform.OS === 'android') setShowPicker(false);
            } else setShowPicker(false);
        };

        const openDatePicker = (mode) => {
            setPickerMode(mode);
            setDate(new Date()); 
            setShowPicker(true);
        };

        const handleAddItem = async (nameOverride = null) => {
            const nome = nameOverride || searchQuery;
            const qtd = quantity || '1';
            if (!nome) return Alert.alert("Atenção", "Informe um ingrediente.");
            const dataParaBanco = formatDateForDB(validade);

            try {
                await api.post('/app/geladeira', {
                    ingrediente: nome,
                    quantidade: parseInt(qtd),
                    validade: dataParaBanco 
                });
                setSearchQuery(''); setQuantity(''); setValidade(''); setShowAddModal(false);
                if (Platform.OS === 'web') alert("Item adicionado!"); else Alert.alert("Sucesso", "Item adicionado!");
                fetchFridge();
            } catch (error) { Alert.alert("Erro", "Erro ao adicionar item."); }
        };

        const executeDelete = async (id) => {
            try { await api.delete(`/app/geladeira/${id}`); fetchFridge(); } catch (e) { alert("Falha ao remover."); }
        };

        const handleDelete = (id) => {
            if (Platform.OS === 'web') { if (window.confirm("Remover item?")) executeDelete(id); }
            else { Alert.alert("Remover", "Remover este item?", [{ text: "Não" }, { text: "Sim", onPress: () => executeDelete(id) }]); }
        };

        const openEdit = (item) => {
            setEditItem(item);
            setEditQtd(String(item.quantidade));
            if (item.validade) {
                setEditVal(formatDateFromDB(item.validade));
                const safeDate = new Date(item.validade);
                const userTimezoneOffset = safeDate.getTimezoneOffset() * 60000;
                const adjustedDate = new Date(safeDate.getTime() + userTimezoneOffset);
                if (!isNaN(adjustedDate)) setDate(adjustedDate);
            } else { setEditVal(''); setDate(new Date()); }
            setModalVisible(true);
        };

        const saveEdit = async () => {
            if (!editItem) return;
            const dataParaBanco = formatDateForDB(editVal);
            try {
                await api.put(`/app/geladeira/${editItem.id}`, { quantidade: parseInt(editQtd), validade: dataParaBanco });
                setModalVisible(false); fetchFridge();
            } catch (error) { alert("Falha ao atualizar."); }
        };

        // --- RENDERIZADORES ---
    const renderHeader = () => {
        // Calcula o total de itens somando todas as seções
        const totalItems = fridgeData.reduce((acc, section) => acc + section.data.length, 0);

        return (
            <View style={styles.headerContainer}>
                <View>
                    
                    <Text style={styles.headerTitle}>Minha Geladeira</Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{totalItems}</Text>
                </View>
            </View>
        );
    };

        const renderItem = ({ item }) => {
            let dataFormatada = '—';
            let isVencido = false;
            if (item.validade) {
                const [ano, mes, dia] = item.validade.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
                const hoje = new Date(); hoje.setHours(0,0,0,0);
                const dataValidade = new Date(item.validade); dataValidade.setHours(0,0,0,0); dataValidade.setDate(dataValidade.getDate() + 1);
                if (dataValidade < hoje) isVencido = true;
            }
            return (
                <View style={[styles.itemCard, isVencido && styles.itemCardVencido]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.ingrediente}</Text>
                        <View style={styles.itemMeta}>
                            <Text style={styles.itemQtd}>Qtd: {item.quantidade}</Text>
                            <View style={styles.validadeBox}>
                                <Ionicons name={isVencido ? "warning" : "calendar-outline"} size={14} color={isVencido ? '#D32F2F' : '#666'} />
                                <Text style={[styles.itemDate, isVencido && styles.textVencido]}>{isVencido ? ` Vencido: ${dataFormatada}` : ` ${dataFormatada}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}><Ionicons name="create-outline" size={22} color="#1976D2" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}><Ionicons name="trash-outline" size={22} color="#D32F2F" /></TouchableOpacity>
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
                    renderSectionHeader={({ section: { title } }) => (<View style={styles.sectionHeader}><Text style={styles.sectionTitleText}>{title}</Text></View>)}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={!loading && (<View style={styles.emptyState}><Ionicons name="basket-outline" size={48} color="#CCC" /><Text style={{ color: '#999', marginTop: 10 }}>Sua geladeira está vazia.</Text></View>)}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
                {loading && <View style={styles.loader}><ActivityIndicator size="large" color="#D9682B" /></View>}
                
                <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setShowAddModal(true)}><Ionicons name="add" size={32} color="#FFF" /></TouchableOpacity>

                {/* --- MODAL ADICIONAR --- */}
                <Modal visible={showAddModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.addModalContent}>
                            <View style={styles.modalHeaderRow}>
                                <Text style={styles.cardTitle}>Novo Ingrediente</Text>
                                <TouchableOpacity onPress={() => setShowAddModal(false)}><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
                            </View>

                            {/* INPUT INGREDIENTE + AUTOCOMPLETE */}
                            {/* Aumentamos o zIndex aqui para garantir que fique por cima */}
                            <View style={{ zIndex: 9999, elevation: 10, marginBottom: 15 }}> 
                                <Text style={styles.label}>Nome do Ingrediente</Text>
                                <TextInput style={styles.input} placeholder="Ex: Cenoura" value={searchQuery} onChangeText={handleSearchInput} />
                                
                                {showSuggestions && suggestions.length > 0 && (
                                    <View style={styles.suggestionsBox}>
                                        {/* ScrollView interno para rolar se tiver muitas sugestões */}
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 150 }}>
                                            {suggestions.map(s => (
                                                <TouchableOpacity key={s.id} style={styles.suggestionItem} onPress={() => selectSuggestion(s.nome)}>
                                                    <Text style={styles.suggestionText}>{s.nome}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* OUTROS INPUTS (Z-Index baixo) */}
                            <View style={[styles.row, { zIndex: 1 }]}>
                                <View style={[styles.col, { flex: 0.3 }]}>
                                    <Text style={styles.label}>Qtd</Text>
                                    <TextInput style={styles.input} keyboardType="numeric" placeholder="1" value={quantity} onChangeText={setQuantity} />
                                </View>
                                <View style={[styles.col, { flex: 0.65 }]}>
                                    <Text style={styles.label}>Validade (DD/MM/AAAA)</Text>
                                    {Platform.OS === 'web' ? (
                                        <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={validade} maxLength={10} onChangeText={(t) => handleDateMask(t, 'add')} />
                                    ) : (
                                        <TouchableOpacity onPress={() => openDatePicker('add')} style={[styles.input, { justifyContent: 'center' }]}>
                                            <Text style={{ color: validade ? '#000' : '#999' }}>{validade || 'Selecionar'}</Text>
                                            <Ionicons name="calendar" size={20} color="#666" style={{ position: 'absolute', right: 10 }}/>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.btnAdd, { zIndex: 1 }]} onPress={() => handleAddItem()}>
                                <Text style={styles.btnAddText}>ADICIONAR</Text>
                            </TouchableOpacity>

                            <Text style={[styles.sectionHeaderTitle, {marginTop: 20, marginBottom: 10, zIndex: 1}]}>Itens rápidos:</Text>
                            <View style={{height: 50, zIndex: 1}}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {BASIC_INGREDIENTS.map((item, idx) => (
                                        <TouchableOpacity key={idx} style={styles.chip} onPress={() => handleAddItem(item)}>
                                            <Text style={styles.chipText}>+ {item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* --- MODAL EDITAR --- */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.cardTitle}>Editar Item</Text>
                            <Text style={styles.label}>Quantidade</Text>
                            <TextInput style={styles.input} keyboardType="numeric" value={editQtd} onChangeText={setEditQtd} />
                            <Text style={styles.label}>Validade (DD/MM/AAAA)</Text>
                            {Platform.OS === 'web' ? (
                                <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={editVal} maxLength={10} onChangeText={(t) => handleDateMask(t, 'edit')} />
                            ) : (
                                <TouchableOpacity onPress={() => openDatePicker('edit')} style={[styles.input, { justifyContent: 'center' }]}>
                                    <Text style={{ color: editVal ? '#000' : '#999' }}>{editVal || 'Selecionar data'}</Text>
                                    <Ionicons name="calendar" size={20} color="#666" style={{ position: 'absolute', right: 10 }}/>
                                </TouchableOpacity>
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}><Text style={{ color: '#666' }}>Cancelar</Text></TouchableOpacity>
                                <TouchableOpacity onPress={saveEdit} style={styles.btnSave}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salvar</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {showPicker && Platform.OS !== 'web' && (<DateTimePicker testID="dateTimePicker" value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onPickerChange} />)}
            </View>
        );
    }

const styles = StyleSheet.create({
    // --- CONTAINER GERAL ---
    container: { 
        flex: 1, 
        backgroundColor: '#F4F6F9' // Um cinza azulado bem claro, mais moderno que branco puro
    },

    // --- HEADER TECNOLÓGICO ---
    headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 50, // Espaço para barra de status
    paddingBottom: 25,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    // Sombra suave
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 4, 
    shadowColor: '#D9682B', // Sombra levemente laranja
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 10,
    },
    headerLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#D9682B',
        letterSpacing: 1.5, // Espaçamento "Tech"
        textTransform: 'uppercase',
        opacity: 0.8,
        marginBottom: 2
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900', // Extra bold
        color: '#D9682B',
        letterSpacing: -0.5,
    },
    countBadge: {
        backgroundColor: '#FFF4E6',
        minWidth: 44,
        height: 44,
        borderRadius: 14, // Quadrado arredondado (Squircle) é mais moderno que circulo
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE0B2'
    },
    countText: {
        color: '#D9682B',
        fontWeight: '800',
        fontSize: 18
    },
    subtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 5,
        fontWeight: '500'
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    // --- LISTA DE ITENS (CARDS) ---
    sectionHeader: { 
        backgroundColor: 'transparent', 
        paddingVertical: 10, 
        paddingHorizontal: 24,
        marginTop: 10
    },
    sectionTitleText: { 
        fontSize: 12, 
        fontWeight: '800', 
        color: '#A0A0A5', 
        textTransform: 'uppercase', 
        letterSpacing: 1 
    },
    itemCard: { 
        flexDirection: 'row', 
        backgroundColor: '#FFF', 
        padding: 16, 
        marginHorizontal: 20, 
        marginBottom: 12, 
        borderRadius: 18, // Bordas bem curvas
        
        // Efeito de Profundidade
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        
        borderLeftWidth: 5, 
        borderLeftColor: '#50D9B0', // Verde padrão (saudável)
    },
    itemCardVencido: { 
        borderLeftColor: '#FF5252', // Vermelho neon
        backgroundColor: '#FFF0F0' 
    },
    itemName: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#2C3E50',
        marginBottom: 4
    },
    itemMeta: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flexWrap: 'wrap' 
    },
    itemQtd: { 
        fontSize: 11, 
        fontWeight: '700',
        backgroundColor: '#F0F2F5', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8, 
        marginRight: 10, 
        color: '#555',
        overflow: 'hidden'
    },
    validadeBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 
    },
    itemDate: { 
        fontSize: 12, 
        color: '#888',
        fontWeight: '500' 
    },
    textVencido: { 
        color: '#FF5252', 
        fontWeight: 'bold' 
    },
    actions: { 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingLeft: 10
    },
    actionBtn: { 
        padding: 8, 
        backgroundColor: '#F5F7FA', // Botão com fundo sutil
        borderRadius: 10,
        marginLeft: 8
    },

    // --- FAB (BOTÃO FLUTUANTE) ---
    fab: { 
        position: 'absolute', 
        bottom: 30, 
        right: 24, 
        width: 64, 
        height: 64, 
        borderRadius: 24, // Squircle
        backgroundColor: '#D9682B', 
        justifyContent: 'center', 
        alignItems: 'center', 
        
        // Sombra "Glow" Laranja
        shadowColor: "#D9682B", 
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 12, 
        elevation: 10, 
        zIndex: 999 
    },

    // --- MODAL E FORMULÁRIOS ---
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(30, 30, 30, 0.4)', // Fundo escuro blur
        justifyContent: 'flex-end' // Modal vem de baixo (sheet style)
    },
    addModalContent: { 
        backgroundColor: '#FFF', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 30, 
        maxHeight: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20
    },
    modalContent: {
        backgroundColor: '#FFF', 
        borderRadius: 24,
        padding: 24,
        margin: 20,
        justifyContent: 'center',
        elevation: 10
    },
    modalHeaderRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 25 
    },
    cardTitle: { 
        fontSize: 22, 
        fontWeight: '800', 
        color: '#1A1A1A',
        letterSpacing: -0.5
    },
    
    // Inputs estilo "Filled" (Moderno)
    label: { 
        fontSize: 11, 
        color: '#8E8E93', 
        fontWeight: '700', 
        marginBottom: 6, 
        textTransform: 'uppercase',
        marginLeft: 4
    },
    input: { 
        backgroundColor: '#F2F4F8', // Fundo cinza suave em vez de borda
        borderRadius: 12, 
        padding: 14, 
        marginBottom: 16, 
        fontSize: 16, 
        color: '#333',
        height: 54,
        borderWidth: 1,
        borderColor: 'transparent' // Borda invisível até focar (opcional)
    },
    
    // Sugestões (Autocomplete)
    suggestionsBox: {
        position: 'absolute', 
        top: 80, // Ajuste fino baseado na posição do input
        left: 0, 
        right: 0, 
        backgroundColor: '#FFF', 
        borderRadius: 16, 
        elevation: 15, 
        zIndex: 9999, 
        marginTop: 5, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    suggestionItem: { 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center'
    },
    suggestionText: { 
        fontSize: 15, 
        color: '#444',
        fontWeight: '500'
    },

    // Botões
    btnAdd: { 
        backgroundColor: '#D9682B', 
        padding: 16, 
        borderRadius: 14, 
        alignItems: 'center', 
        marginTop: 10,
        shadowColor: "#D9682B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    btnAddText: { 
        color: '#FFF', 
        fontWeight: '800', 
        fontSize: 16,
        letterSpacing: 1
    },
    modalButtons: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: 20, 
        gap: 12 
    },
    btnSave: { 
        backgroundColor: '#D9682B', 
        paddingHorizontal: 24, 
        paddingVertical: 12, 
        borderRadius: 10,
        elevation: 2
    },
    btnCancel: { 
        paddingVertical: 12, 
        paddingHorizontal: 16,
        borderRadius: 10,
    },

    // Chips (Itens Rápidos)
    chip: { 
        backgroundColor: '#FFF', 
        borderWidth: 1, 
        borderColor: '#E0E0E0', // Borda cinza suave
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        borderRadius: 25, 
        marginRight: 10, 
        justifyContent: 'center',
        elevation: 1
    },
    chipText: { 
        color: '#555', 
        fontWeight: '600', 
        fontSize: 13 
    },
    
    // Outros
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { },
    emptyState: { alignItems: 'center', padding: 40, marginTop: 40, opacity: 0.6 },
    loader: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
});