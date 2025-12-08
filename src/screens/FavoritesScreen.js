import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function FavoritesScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect carrega a lista toda vez que você entra na tela
    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    async function loadFavorites() {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            const response = await api.get('/favoritos', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("MEUS FAVORITOS:", response.data.data);
            
            setFavorites(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function removeFavorite(id) {
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            
            // Remove visualmente
            setFavorites(favorites.filter(item => item.recipe_id !== id));

            // Remove no backend
            await api.post('/favoritos/toggle', { recipe_id: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log("Erro ao remover");
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('RecipeDetails', { id: item.recipe_id })}
        >
            <TouchableOpacity 
                style={styles.favButton} 
                onPress={() => removeFavorite(item.recipe_id)}
            >
                <Ionicons name="heart" size={24} color="#e74c3c" />
            </TouchableOpacity>

            <Image 
                source={item.image ? { uri: item.image } : require('../assets/semImagem.jpeg')} 
                style={styles.cardImage} 
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.cardInfo}>
                    <Ionicons name="flame-outline" size={14} color="#D9682B" /> {item.calories || 'N/A'} kcal
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D9682B" /></View>;

    return (
        <View style={styles.container}>
            
            {/* NOVO CABEÇALHO */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerLabel}>SUA COLEÇÃO</Text>
                    <Text style={styles.headerTitle}>Receitas Favoritas</Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{favorites.length}</Text>
                </View>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent} // Ajustei o padding aqui
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-dislike-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
                        <Text style={styles.emptySubText}>Explore receitas e clique no coração para salvar aqui.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8F9FA', // Fundo levemente off-white
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    // --- ESTILOS DO CABEÇALHO ---
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: 50, // Espaço para a barra de status
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 2, // Sombra leve no Android
        shadowColor: '#000', // Sombra leve no iOS
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 }
    },
    headerLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D9682B', // Laranja
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#D9682B',
        letterSpacing: -0.5
    },
    countBadge: {
        backgroundColor: '#FFF4E6', // Fundo laranja bem claro
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2'
    },
    countText: {
        color: '#D9682B',
        fontWeight: 'bold',
        fontSize: 16
    },

    // --- ESTILOS DA LISTA E CARDS ---
    listContent: {
        padding: 20,
        paddingBottom: 100 // Espaço extra no final para não cortar o último item
    },
    card: { 
        backgroundColor: '#fff', 
        borderRadius: 20, // Bordas mais arredondadas
        marginBottom: 20, 
        overflow: 'hidden', 
        
        // Sombra sofisticada
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardImage: { 
        width: '100%', 
        height: 200 // Imagem um pouco mais alta
    },
    cardContent: { 
        padding: 16,
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#333', 
        marginBottom: 8,
        lineHeight: 24
    },
    cardInfo: { 
        fontSize: 14, 
        color: '#666', 
        fontWeight: '500',
        flexDirection: 'row',
        alignItems: 'center'
    },
    favButton: { 
        position: 'absolute', 
        top: 15, 
        right: 15, 
        zIndex: 10, 
        backgroundColor: '#fff', 
        borderRadius: 50, // Perfeitamente redondo
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        
        // Sombra no botão
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 }
    },

    // --- ESTILO DE "VAZIO" ---
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 20, 
        color: '#333', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    emptySubText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#999',
        fontSize: 14,
        paddingHorizontal: 40
    }
});