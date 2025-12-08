import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Importante para atualizar ao voltar
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Novos estados para o planejamento
    const [todayPlan, setTodayPlan] = useState(null); // Armazena a receita do momento
    const [currentMealLabel, setCurrentMealLabel] = useState(''); // Armazena "Almoço", "Jantar", etc.

    // Carrega dados toda vez que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function loadData() {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            
            // 1. CARREGA DESTAQUES (Mantido igual)
            const resFeatured = await api.get('/receitas/destaques', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const receitasFiltradas = resFeatured.data.data.filter(item => item.recipe_image);
            setFeaturedRecipes(receitasFiltradas);

            // 2. CARREGA PLANEJAMENTO DE HOJE (Novo)
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            const resPlan = await api.get(`/planejamento?start=${today}&end=${today}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const plans = resPlan.data.data || [];
            
            // LÓGICA DE HORÁRIO
            const hour = new Date().getHours();
            let mealType = 'Café da manhã';

            // Defina aqui seus horários de corte
            if (hour >= 11 && hour < 16) {
                mealType = 'Almoço';
            } else if (hour >= 16) {
                mealType = 'Jantar';
            }
            
            setCurrentMealLabel(mealType);

            // Procura se existe plano para esse tipo
            const activePlan = plans.find(p => p.meal_type === mealType);
            setTodayPlan(activePlan || null);

        } catch (error) {
            console.log("Erro ao carregar dados home:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* === SEÇÃO 1: BANNER HERO (Mantido) === */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>
                        TRANSFORME SEUS <Text style={styles.highlight}>INGREDIENTES.</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Receitas inteligentes com o que você já tem em casa.
                    </Text>

                    <View style={styles.heroImageContainer}>
                        <Image 
                            source={require('../../assets/images/card1.jpg')} 
                            style={styles.heroImage}
                        />
                        <View style={styles.imageOverlay} />
                    </View>

                    <TouchableOpacity 
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Receitas')} 
                    >
                        <Text style={styles.primaryButtonText}>EXPLORAR AGORA</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* === SEÇÃO 2: PLANEJAMENTO (MODIFICADA) === */}
                <View style={styles.planningSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>PLANEJAMENTO</Text>
                        <View style={styles.badge}>
                            {/* Mostra qual refeição estamos focando agora */}
                            <Text style={styles.badgeText}>{currentMealLabel.toUpperCase()} DE HOJE</Text>
                        </View>
                    </View>

                    {todayPlan ? (
                        // CASO 1: TEM RECEITA PLANEJADA PARA O HORÁRIO
                        <TouchableOpacity 
                            style={styles.activePlanCard}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('RecipeDetails', { id: todayPlan.recipe_id })}
                        >
                            <Image 
                                source={todayPlan.recipe_image ? { uri: todayPlan.recipe_image } : require('../assets/semImagem.jpeg')} 
                                style={styles.activePlanImage}
                            />
                            <View style={styles.activePlanContent}>
                                <Text style={styles.activePlanLabel}>Sugestão do seu plano:</Text>
                                <Text style={styles.activePlanTitle} numberOfLines={2}>
                                    {todayPlan.recipe_name}
                                </Text>
                                <View style={styles.activePlanMeta}>
                                    <View style={styles.metaItem}>
                                        <MaterialIcons name="local-fire-department" size={16} color="#D9682B" />
                                        <Text style={styles.metaText}>{Math.round(todayPlan.calories)} kcal</Text>
                                    </View>
                                    <View style={styles.buttonLink}>
                                        <Text style={styles.buttonLinkText}>VER RECEITA</Text>
                                        <MaterialIcons name="chevron-right" size={20} color="#D9682B" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        // CASO 2: NÃO TEM NADA PLANEJADO (Mostra o card genérico antigo)
                        <View style={styles.planningCard}>
                            <View style={styles.planningTextContainer}>
                                <Text style={styles.planningTitle}>Nada planejado para o {currentMealLabel}</Text>
                                <Text style={styles.planningDescription}>
                                    Que tal escolher algo agora?
                                </Text>
                                
                                <TouchableOpacity 
                                    style={styles.outlineButton}
                                    onPress={() => navigation.navigate('Planejamento')} 
                                >
                                    <Text style={styles.outlineButtonText}>PLANEJAR</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <Image 
                                source={require('../../assets/images/card2.jpg')} 
                                style={styles.planningImage}
                            />
                        </View>
                    )}
                </View>

                {/* === SEÇÃO 3: DESTAQUES (Mantida) === */}
                <View style={styles.featuredSection}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>DESTAQUES</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Receitas')}>
                            <Text style={styles.seeMoreText}>Ver tudo</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && featuredRecipes.length === 0 ? (
                        <ActivityIndicator size="large" color="#D9682B" style={{marginTop: 20}} />
                    ) : (
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                        >
                            {featuredRecipes.map((item) => (
                                <TouchableOpacity 
                                    key={item.recipe_id} 
                                    style={styles.card}
                                    activeOpacity={0.9}
                                    onPress={() => navigation.navigate('RecipeDetails', { id: item.recipe_id })}
                                >
                                    <Image 
                                        source={
                                            item.recipe_image 
                                            ? { uri: item.recipe_image } 
                                            : require('../assets/semImagem.jpeg')
                                        } 
                                        style={styles.cardImage} 
                                    />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>
                                            {item.recipe_name}
                                        </Text>
                                        <View style={styles.cardFooter}>
                                            <MaterialIcons name="local-fire-department" size={16} color="#D9682B" />
                                            <Text style={styles.cardCal}>
                                                {item.recipe_nutrition?.calories || 'N/A'} kcal
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={{ height: 60 }} />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F4' },
    scrollContent: { paddingTop: 20 },
    
    // --- ESTILOS DO HERO (Mantidos iguais aos seus) ---
    heroSection: { paddingHorizontal: 24, marginBottom: 35 },
    heroTitle: { fontSize: 32, fontWeight: '900', color: '#1E2029', letterSpacing: -1, lineHeight: 38, marginBottom: 20 },
    highlight: { color: '#D9682B' },
    heroSubtitle: { fontSize: 16, color: '#8F9BB3', marginBottom: 20, lineHeight: 24 },
    heroImageContainer: { width: '100%', height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
    primaryButton: { flexDirection: 'row', height: 56, backgroundColor: '#D9682B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: '#D9682B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    // --- HEADERS ---
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, paddingHorizontal: 24 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1E2029', letterSpacing: 0.5, textTransform: 'uppercase' },
    badge: { backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: '#D9682B', fontWeight: 'bold', fontSize: 10 },
    seeMoreText: { color: '#D9682B', fontWeight: '600', fontSize: 14 },

    // --- PLANNING (GENÉRICO) ---
    planningSection: { marginBottom: 35 },
    planningCard: { marginHorizontal: 24, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, gap: 15 },
    planningTextContainer: { flex: 1 },
    planningTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E2029', marginBottom: 5 },
    planningDescription: { fontSize: 12, color: '#8F9BB3', marginBottom: 15, lineHeight: 18 },
    outlineButton: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1.5, borderColor: '#D9682B', borderRadius: 8, alignSelf: 'flex-start' },
    outlineButtonText: { color: '#D9682B', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    planningImage: { width: 80, height: 80, borderRadius: 12, resizeMode: 'cover' },

    // --- NOVO: ACTIVE PLAN CARD (QUANDO TEM RECEITA) ---
    activePlanCard: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4
    },
    activePlanImage: { width: '100%', height: 140, resizeMode: 'cover' },
    activePlanContent: { padding: 16 },
    activePlanLabel: { fontSize: 12, color: '#8F9BB3', textTransform: 'uppercase', marginBottom: 4, fontWeight: '600' },
    activePlanTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E2029', marginBottom: 12 },
    activePlanMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { fontSize: 14, color: '#666', fontWeight: '500' },
    buttonLink: { flexDirection: 'row', alignItems: 'center' },
    buttonLinkText: { fontSize: 12, fontWeight: 'bold', color: '#D9682B' },

    // --- DESTAQUES ---
    featuredSection: { marginBottom: 20 },
    card: { width: 160, backgroundColor: '#FFFFFF', borderRadius: 16, marginRight: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, marginBottom: 5 },
    cardImage: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'cover' },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E2029', marginBottom: 6 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    cardCal: { fontSize: 12, color: '#8F9BB3', fontWeight: '500' }
});