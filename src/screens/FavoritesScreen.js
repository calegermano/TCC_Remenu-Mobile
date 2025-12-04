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
            <FlatList
                data={favorites}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
    cardImage: { width: '100%', height: 180 },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    cardInfo: { fontSize: 14, color: '#666' },
    favButton: { position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 6, elevation: 5 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});