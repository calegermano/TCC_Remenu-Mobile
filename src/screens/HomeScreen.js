import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function HomeScreen() {
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarReceitas();
    }, []);

    async function carregarReceitas() {
        try {
            // Pega o token salvo
            const token = await AsyncStorage.getItem('@remenu_token');
            
            // Configura o token no cabeçalho
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Chama a rota de destaques ou a busca padrão
            const response = await api.get('/receitas/destaques', config);
            
            setReceitas(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.recipe_image || 'https://via.placeholder.com/150' }} 
                style={styles.image} 
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.recipe_name}</Text>
                <Text style={styles.cardInfo}>
                    {item.recipe_nutrition?.calories || 'N/A'} kcal
                </Text>
            </View>
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D9682B" /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Destaques</Text>
            <FlatList
                data={receitas}
                keyExtractor={(item) => String(item.recipe_id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 30 },
    card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
    image: { width: '100%', height: 180 },
    cardContent: { padding: 15 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    cardInfo: { fontSize: 14, color: '#666' }
});