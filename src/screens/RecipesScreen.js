import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList, Image,
  Modal, ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../services/api';

export default function RecipesScreen({ navigation }) {
    // Estados de Dados
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Estados de Filtro
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    
    // Filtros Selecionados
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [minCal, setMinCal] = useState('');
    const [maxCal, setMaxCal] = useState('');
    const [minTime, setMinTime] = useState('');
    const [maxTime, setMaxTime] = useState('');

    // Tipos disponíveis (Iguais da Web)
    const recipeTypes = [
        { id: 'Main Dish', label: 'Prato Principal' },
        { id: 'Breakfast', label: 'Café da Manhã' },
        { id: 'Salad', label: 'Salada' },
        { id: 'Soup', label: 'Sopa' },
        { id: 'Dessert', label: 'Sobremesa' },
        { id: 'Beverage', label: 'Bebidas' },
    ];

    // Carregar Receitas
    async function fetchRecipes(newPage = 0, shouldRefresh = false) {
        if (loading) return;
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            
            const params = {
                page: newPage,
                search: search,
                types: selectedTypes,
                min_cal: minCal,
                max_cal: maxCal,
                min_time: minTime,
                max_time: maxTime
            };

            const response = await api.get('/receitas', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            const newRecipes = response.data.data;

            if (shouldRefresh) {
                setRecipes(newRecipes);
            } else {
                setRecipes(prev => [...prev, ...newRecipes]);
            }

            // Se vier menos que 20 itens, provavelmente acabou
            setHasMore(newRecipes.length >= 20);
            setPage(newPage);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível carregar as receitas.');
        } finally {
            setLoading(false);
        }
    }

    // Carrega ao abrir
    useEffect(() => {
        fetchRecipes(0, true);
    }, []);

    // Função de Busca
    function handleSearch() {
        fetchRecipes(0, true);
    }

    // Função de Aplicar Filtros
    function applyFilters() {
        setModalVisible(false);
        fetchRecipes(0, true);
    }

    // Toggle de Tipo de Receita
    function toggleType(typeId) {
        if (selectedTypes.includes(typeId)) {
            setSelectedTypes(selectedTypes.filter(t => t !== typeId));
        } else {
            setSelectedTypes([...selectedTypes, typeId]);
        }
    }

    // Função para favoritar/desfavoritar
    async function toggleFavorite(recipe) {
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            
            // Atualiza visualmente na hora (Otimista)
            const newRecipes = recipes.map(r => {
                if (r.recipe_id === recipe.recipe_id) {
                    return { ...r, is_favorite: !r.is_favorite };
                }
                return r;
            });
            setRecipes(newRecipes);

            // Envia para o Backend
            await api.post('/favoritos/toggle', {
                recipe_id: recipe.recipe_id,
                name: recipe.recipe_name,
                image: recipe.recipe_image,
                calories: recipe.recipe_nutrition?.calories
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível favoritar.');
            // Se der erro, reverte a lista (opcional)
        }
    }

    // Renderiza cada Card
    const renderItem = ({ item }) => {
        const prep = parseInt(item.preparation_time_min) || 0;
        const cook = parseInt(item.cooking_time_min) || 0;
        const totalTime = prep + cook;

        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('RecipeDetails', { id: item.recipe_id })}
            >
                {/* BOTÃO DE FAVORITO (Coração) */}
                <TouchableOpacity 
                    style={styles.favButton} 
                    onPress={() => toggleFavorite(item)}
                >
                    <Ionicons 
                        name={item.is_favorite ? "heart" : "heart-outline"} 
                        size={24} 
                        color={item.is_favorite ? "#e74c3c" : "#666"} 
                    />
                </TouchableOpacity>

                <Image 
                    source={
                        item.recipe_image 
                        ? { uri: item.recipe_image } 
                        : require('../assets/semImagem.jpeg') 
                    }
                    style={styles.cardImage} 
                    resizeMode="cover"
                />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.recipe_name}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardInfo}>
                            <Ionicons name="flame-outline" size={14} color="#D9682B" /> {item.recipe_nutrition?.calories || 'N/A'} kcal
                        </Text>
                        {totalTime > 0 && (
                            <Text style={styles.cardInfo}>
                                <Ionicons name="time-outline" size={14} color="#666" /> {totalTime} min
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.container}>
            
            {/* Barra de Busca e Filtro */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
                    <TextInput 
                        style={styles.input}
                        placeholder="Buscar receitas..."
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={handleSearch}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="options" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Lista de Receitas */}
            <FlatList
                data={recipes}
                keyExtractor={(item, index) => String(item.recipe_id) + index}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                onEndReached={() => {
                    if (hasMore && !loading) fetchRecipes(page + 1);
                }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#D9682B" />}
                ListEmptyComponent={!loading && <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>}
            />

            {/* MODAL DE FILTROS */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <Text style={styles.filterLabel}>Categorias</Text>
                            <View style={styles.typesContainer}>
                                {recipeTypes.map(type => (
                                    <TouchableOpacity 
                                        key={type.id} 
                                        style={[styles.typeChip, selectedTypes.includes(type.id) && styles.typeChipSelected]}
                                        onPress={() => toggleType(type.id)}
                                    >
                                        <Text style={[styles.typeText, selectedTypes.includes(type.id) && styles.typeTextSelected]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterLabel}>Calorias (kcal)</Text>
                            <View style={styles.rowInputs}>
                                <TextInput 
                                    style={styles.smallInput} 
                                    placeholder="Mín" 
                                    keyboardType="numeric"
                                    value={minCal} onChangeText={setMinCal}
                                />
                                <Text>-</Text>
                                <TextInput 
                                    style={styles.smallInput} 
                                    placeholder="Máx" 
                                    keyboardType="numeric"
                                    value={maxCal} onChangeText={setMaxCal}
                                />
                            </View>

                            <Text style={styles.filterLabel}>Tempo de Preparo (min)</Text>
                            <View style={styles.rowInputs}>
                                <TextInput 
                                    style={styles.smallInput} 
                                    placeholder="Mín" 
                                    keyboardType="numeric"
                                    value={minTime} onChangeText={setMinTime}
                                />
                                <Text>-</Text>
                                <TextInput 
                                    style={styles.smallInput} 
                                    placeholder="Máx" 
                                    keyboardType="numeric"
                                    value={maxTime} onChangeText={setMaxTime}
                                />
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { 
    backgroundColor: '#fff',
    paddingTop: 30, // Espaço para barra de status
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
    searchContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, alignItems: 'center', height: 45 },
    input: { flex: 1, height: '100%' },
    filterButton: { marginLeft: 10, backgroundColor: '#50D9B0', padding: 10, borderRadius: 8 },
    
    // Card
    card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
    cardImage: { width: '100%', height: 180 },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    cardInfo: { fontSize: 14, color: '#666' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#D9682B' },
    filterLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#333' },
    
    typesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
    typeChipSelected: { backgroundColor: '#D9682B', borderColor: '#D9682B' },
    typeText: { color: '#666' },
    typeTextSelected: { color: '#fff', fontWeight: 'bold' },

    rowInputs: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    smallInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, textAlign: 'center' },
    
    applyButton: { backgroundColor: '#D9682B', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    favButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 6,
        elevation: 5
    },
});