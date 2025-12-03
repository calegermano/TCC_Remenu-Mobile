import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    Image, 
    TouchableOpacity, 
    Dimensions,
    StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

    // DADOS ESTÁTICOS (Simulando o que viria do banco)
    // Você pode alterar as imagens ou textos aqui manualmente
    const receitasDestaque = [
        { 
            id: '1', 
            nome: 'Bowl de Açaí Tropical', 
            calorias: '420 kcal', 
            // Se não tiver essas imagens na pasta, troque por { uri: 'https://...' }
            imagem: require('../../assets/images/card2.jpg') 
        },
        { 
            id: '2', 
            nome: 'Torrada com Abacate', 
            calorias: '280 kcal', 
            imagem: require('../../assets/images/card3.jpg') 
        },
        { 
            id: '3', 
            nome: 'Salada de Atum Fresh', 
            calorias: '350 kcal', 
            imagem: require('../../assets/images/card1.jpg') 
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />
            
            {/* Background Decorativo (Marca d'água) */}
            <View style={styles.watermarkContainer}>
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.watermarkLogo}
                />
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                
                {/* === SEÇÃO 1: BANNER HERO === */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>
                        TRANSFORME SEUS <Text style={styles.highlight}>INGREDIENTES.</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Receitas inteligentes com o que você já tem em casa.
                    </Text>

                    {/* Imagem Banner Principal */}
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
                        // Navega para a tela de listagem (ajuste o nome da rota conforme seu App.js/TabNavigator)
                        onPress={() => navigation.navigate('Receitas')} 
                    >
                        <Text style={styles.primaryButtonText}>EXPLORAR AGORA</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* === SEÇÃO 2: PLANEJAMENTO === */}
                <View style={styles.planningSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>PLANEJAMENTO</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>HOJE</Text>
                        </View>
                    </View>

                    <View style={styles.planningCard}>
                        <View style={styles.planningTextContainer}>
                            <Text style={styles.planningTitle}>Sua Dieta em Dia</Text>
                            <Text style={styles.planningDescription}>
                                Organize seu cardápio semanal com facilidade.
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
                </View>

                {/* === SEÇÃO 3: DESTAQUES (Estático) === */}
                <View style={styles.featuredSection}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>DESTAQUES</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Receitas')}>
                            <Text style={styles.seeMoreText}>Ver tudo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Lista Horizontal de Cards */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                    >
                        {receitasDestaque.map((item) => (
                            <TouchableOpacity 
                                key={item.id} 
                                style={styles.card}
                                activeOpacity={0.9}
                            >
                                <Image source={item.imagem} style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
                                    <View style={styles.cardFooter}>
                                        <MaterialIcons name="local-fire-department" size={16} color="#D9682B" />
                                        <Text style={styles.cardCal}>{item.calorias}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Espaço extra no final para o scroll não cortar */}
                <View style={{ height: 60 }} />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    // Marca d'água no fundo
    watermarkContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        zIndex: -1,
    },
    watermarkLogo: {
        width: width * 0.8,
        height: width * 0.8,
        opacity: 0.03, 
        resizeMode: 'contain',
        tintColor: '#D9682B'
    },
    scrollContent: {
        paddingTop: 20,
    },

    // --- HERO SECTION ---
    heroSection: {
        paddingHorizontal: 24,
        marginBottom: 35,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1E2029',
        letterSpacing: -1,
        lineHeight: 38,
        marginBottom: 20,
    },
    highlight: { color: '#D9682B' },
    heroSubtitle: {
        fontSize: 16,
        color: '#8F9BB3',
        marginBottom: 20,
        lineHeight: 24,
    },
    heroImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)', 
    },
    primaryButton: {
        flexDirection: 'row',
        height: 56,
        backgroundColor: '#D9682B',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#D9682B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // --- SEÇÃO COMUM (Cabeçalhos) ---
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, paddingHorizontal: 24,
    },
    sectionHeaderRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18, fontWeight: '900', color: '#1E2029', letterSpacing: 0.5, textTransform: 'uppercase',
    },
    badge: {
        backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    },
    badgeText: {
        color: '#D9682B', fontWeight: 'bold', fontSize: 10,
    },
    seeMoreText: {
        color: '#D9682B', fontWeight: '600', fontSize: 14,
    },

    // --- PLANNING CARD ---
    planningSection: { marginBottom: 35 },
    planningCard: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
        gap: 15
    },
    planningTextContainer: { flex: 1 },
    planningTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E2029', marginBottom: 5 },
    planningDescription: { fontSize: 12, color: '#8F9BB3', marginBottom: 15, lineHeight: 18 },
    outlineButton: {
        paddingVertical: 8, paddingHorizontal: 16,
        borderWidth: 1.5, borderColor: '#D9682B', borderRadius: 8, alignSelf: 'flex-start',
    },
    outlineButtonText: { color: '#D9682B', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    planningImage: { width: 80, height: 80, borderRadius: 12, resizeMode: 'cover' },

    // --- CARDS DESTAQUE ---
    featuredSection: { marginBottom: 20 },
    card: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginRight: 16, // Espaço entre os cards
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        marginBottom: 5, // Espaço para sombra não cortar
    },
    cardImage: {
        width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'cover',
    },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E2029', marginBottom: 6 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    cardCal: { fontSize: 12, color: '#8F9BB3', fontWeight: '500' }
});