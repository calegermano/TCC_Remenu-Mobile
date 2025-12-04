import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function RecipeDetailsScreen({ route }) {
    const { id } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDetails() {
            try {
                const token = await AsyncStorage.getItem('@remenu_token');
                const response = await api.get(`/receitas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecipe(response.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadDetails();
    }, [id]);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D9682B" /></View>;
    if (!recipe) return <View style={styles.center}><Text>Erro ao carregar receita.</Text></View>;

    // Tratamento de dados
    let imageSource = require('../assets/semImagem.jpeg'); 
    if (recipe.recipe_image) {
        imageSource = { uri: recipe.recipe_image };
    } else if (recipe.recipe_images && recipe.recipe_images.recipe_image) {
        const imgs = recipe.recipe_images.recipe_image;
        const url = Array.isArray(imgs) ? imgs[0] : imgs;
        imageSource = { uri: url };
    }

    const ingredients = Array.isArray(recipe.ingredients?.ingredient) 
        ? recipe.ingredients.ingredient 
        : (recipe.ingredients?.ingredient ? [recipe.ingredients.ingredient] : []);

    const directions = Array.isArray(recipe.directions?.direction)
        ? recipe.directions.direction
        : (recipe.directions?.direction ? [recipe.directions.direction] : []);

    let nutrition = { calories: 'N/A', protein: '0', carbohydrate: '0', fat: '0' };
    if (recipe.serving_sizes && recipe.serving_sizes.serving) {
        const s = recipe.serving_sizes.serving;
        const data = Array.isArray(s) ? s[0] : s;
        nutrition = {
            calories: data.calories || 'N/A',
            protein: data.protein || '0',
            carbohydrate: data.carbohydrate || '0',
            fat: data.fat || '0'
        };
    } else if (recipe.recipe_nutrition) {
        nutrition = recipe.recipe_nutrition;
    }

    const prepTime = parseInt(recipe.preparation_time_min) || 0;
    const cookTime = parseInt(recipe.cooking_time_min) || 0;
    const totalTime = prepTime + cookTime;

    return (
        <View style={styles.mainContainer}>
            <ScrollView 
                style={styles.scroll} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} // Opcional: esconde a barra feia no mobile
            >
                <Image 
                    source={imageSource} 
                    style={styles.image} 
                    resizeMode="cover"
                />
                
                <View style={styles.content}>
                    <Text style={styles.title}>{recipe.recipe_name}</Text>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Ionicons name="flame" size={24} color="#D9682B" />
                            <Text style={styles.infoValue}>{nutrition.calories}</Text>
                            <Text style={styles.infoLabel}>kcal</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoItem}>
                            <Ionicons name="time" size={24} color="#D9682B" />
                            <Text style={styles.infoValue}>{totalTime > 0 ? totalTime : '-'}</Text>
                            <Text style={styles.infoLabel}>min</Text>
                        </View>
                    </View>

                    <View style={styles.macrosContainer}>
                        <Text style={styles.sectionTitle}>Informação Nutricional</Text>
                        <View style={styles.macrosRow}>
                            <Text style={styles.macroText}>Proteínas: <Text style={styles.bold}>{nutrition.protein}g</Text></Text>
                            <Text style={styles.macroText}>Carboidratos: <Text style={styles.bold}>{nutrition.carbohydrate}g</Text></Text>
                            <Text style={styles.macroText}>Gorduras: <Text style={styles.bold}>{nutrition.fat}g</Text></Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ingredientes</Text>
                    {ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <Ionicons name="ellipse" size={8} color="#D9682B" style={{ marginTop: 6, marginRight: 8 }} />
                            <Text style={styles.textItem}>
                                {ing.ingredient_description || ing.food_name}
                            </Text>
                        </View>
                    ))}

                    <Text style={styles.sectionTitle}>Modo de Preparo</Text>
                    {directions.length > 0 ? (
                        directions.map((dir, index) => (
                            <View key={index} style={styles.stepContainer}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                                <Text style={styles.stepText}>{dir.direction_description}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.textItem}>{recipe.recipe_description}</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // CORREÇÃO PRINCIPAL AQUI:
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#fff',
        // Removemos o height: '100vh'. O flex: 1 vai preencher o espaço disponível dado pelo navegador.
    },
    scroll: { 
        flex: 1, 
        // Removemos height: '100%'. Deixe o flex cuidar do preenchimento.
        width: '100%',
    },
    scrollContent: { 
        flexGrow: 1, 
        paddingBottom: 50 
    },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 250 },
    content: { padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    
    infoCard: { 
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20,
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
        justifyContent: 'space-around', alignItems: 'center',
        // Pequeno ajuste para web não ficar com borda duplicada se tiver sombra
        borderWidth: Platform.OS === 'web' ? 1 : 0, borderColor: '#eee'
    },
    infoItem: { alignItems: 'center' },
    infoValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
    infoLabel: { fontSize: 12, color: '#666' },
    divider: { width: 1, height: '80%', backgroundColor: '#eee' },

    macrosContainer: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    macrosRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5 },
    macroText: { fontSize: 14, color: '#555' },
    bold: { fontWeight: 'bold', color: '#333' },

    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#D9682B', marginTop: 10, marginBottom: 15 },
    
    ingredientRow: { flexDirection: 'row', marginBottom: 8, paddingRight: 10 },
    textItem: { fontSize: 16, color: '#555', lineHeight: 24, flex: 1 },
    
    stepContainer: { flexDirection: 'row', marginBottom: 20 },
    stepNumber: { 
        fontWeight: 'bold', color: '#fff', backgroundColor: '#D9682B', 
        width: 28, height: 28, borderRadius: 14, textAlign: 'center', lineHeight: 28,
        marginRight: 12, fontSize: 14, overflow: 'hidden' // overflow hidden garante o círculo perfeito
    },
    stepText: { flex: 1, fontSize: 16, color: '#555', lineHeight: 24, marginTop: 2 }
});