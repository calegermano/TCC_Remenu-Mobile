import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList, Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import api from '../services/api';

import { Platform } from 'react-native';


export default function PlanningScreen({ navigation }) {
    // Estados de Data
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    
    // Estados de Dados
    const [plans, setPlans] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Estados do Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [targetSlot, setTargetSlot] = useState({ type: '', date: '' });
    
    // NOVO: Estado para o Checkbox de repetir
    const [repeatAllWeek, setRepeatAllWeek] = useState(false);

    const mealTypes = ['Café da manhã', 'Almoço', 'Jantar'];

    useFocusEffect(
        useCallback(() => {
            calculateWeek(selectedDate);
        }, [selectedDate])
    );

    function calculateWeek(refDate) {
        const current = new Date(refDate);
        const day = current.getDay(); 
        const sunday = new Date(current);
        sunday.setDate(current.getDate() - day);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            week.push({
                dateObj: d,
                dateString: d.toISOString().split('T')[0],
                dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
                dayNum: d.getDate()
            });
        }
        setWeekDays(week);
        fetchPlans(week[0].dateString, week[6].dateString);
    }

    async function fetchPlans(start, end) {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            const response = await api.get(`/planejamento?start=${start}&end=${end}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(response.data.data);
        } catch (error) {
            console.log("Erro ao buscar planos", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchFavorites() {
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            const response = await api.get('/favoritos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.data);
        } catch (error) {
            console.log("Erro ao buscar favoritos");
        }
    }

    function openAddModal(type) {
        setTargetSlot({ 
            type: type, 
            date: selectedDate.toISOString().split('T')[0] 
        });
        setRepeatAllWeek(false); // Reseta o checkbox sempre que abrir
        fetchFavorites(); 
        setModalVisible(true);
    }

    // --- FUNÇÃO DE SALVAR ATUALIZADA ---
    async function addPlan(recipe) {
        setModalVisible(false);
        try {
            const token = await AsyncStorage.getItem('@remenu_token');
            
            // Define quais datas salvar: A semana toda ou só o dia clicado
            const datesToSave = repeatAllWeek 
                ? weekDays.map(d => d.dateString) 
                : [targetSlot.date];

            // Loop para salvar (envia uma requisição por dia)
            for (const dateStr of datesToSave) {
                await api.post('/planejamento', {
                    recipe_id: recipe.recipe_id || recipe.id, 
                    date: dateStr, // Usa a data do loop
                    meal_type: targetSlot.type,
                    recipe_name: recipe.name,
                    recipe_image: recipe.image,
                    calories: recipe.calories,
                    protein: recipe.protein || 0,
                    carbs: recipe.carbs || 0
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Recarrega a tela para mostrar as mudanças
            calculateWeek(selectedDate);

        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    }


    async function removePlan(id) {
        // Função real de deletar
        const handleDelete = async () => {
            try {
                const token = await AsyncStorage.getItem('@remenu_token');
                await api.delete(`/planejamento/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                calculateWeek(selectedDate);
            } catch (error) {
                // Se der erro, usa alert simples
                if (Platform.OS === 'web') {
                    alert("Erro ao remover.");
                } else {
                    Alert.alert("Erro", "Falha ao remover.");
                }
            }
        };

        // Verificação Web vs Mobile
        if (Platform.OS === 'web') {
            // No navegador usamos window.confirm
            if (window.confirm("Deseja remover esta refeição?")) {
                handleDelete();
            }
        } else {
            // No celular usamos Alert nativo
            Alert.alert("Remover", "Deseja remover esta refeição?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: handleDelete, style: "destructive" }
            ]);
        }
    }

    function changeWeek(direction) {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction * 7));
        setSelectedDate(newDate);
    }

    const totals = plans.reduce((acc, item) => {
        acc.calories += parseFloat(item.calories) || 0;
        acc.protein += parseFloat(item.protein) || 0;
        acc.carbs += parseFloat(item.carbs) || 0;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0 });

    const totalMeals = plans.length;

    const renderMealSlot = (type) => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const plan = plans.find(p => p.date === dateStr && p.meal_type === type);

        if (plan) {
            return (
                // MUDANÇA: O container agora é uma View (não clicável)
                <View style={[styles.slot, styles.slotFilled]}>
                    
                    {/* Área 1: Clica para ver detalhes (Ocupa todo o espaço sobrando) */}
                    <TouchableOpacity 
                        style={{ flex: 1 }} 
                        onPress={() => navigation.navigate('RecipeDetails', { id: plan.recipe_id })}
                    >
                        <Text style={styles.slotType}>{type}</Text>
                        <Text style={styles.recipeName} numberOfLines={1}>{plan.recipe_name}</Text>
                        <Text style={styles.recipeCal}>{Math.round(plan.calories)} kcal</Text>
                    </TouchableOpacity>

                    {/* Área 2: Botão de Deletar (Separado, ao lado) */}
                    <TouchableOpacity 
                        onPress={() => removePlan(plan.id)} 
                        style={styles.removeBtn}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} // Aumenta a área de toque
                    >
                        <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                </View>
            );
        }

        // ... (o resto do return para slot vazio continua igual)

        return (
            <TouchableOpacity style={[styles.slot, styles.slotEmpty]} onPress={() => openAddModal(type)}>
                <Text style={styles.slotType}>{type}</Text>
                <View style={styles.addIcon}>
                    <Ionicons name="add" size={24} color="#ccc" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => changeWeek(-1)}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => changeWeek(1)}>
                    <Ionicons name="chevron-forward" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.weekStrip}>
                {weekDays.map((day, index) => {
                    const isSelected = day.dateString === selectedDate.toISOString().split('T')[0];
                    return (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                            onPress={() => setSelectedDate(day.dateObj)}
                        >
                            <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>{day.dayName}</Text>
                            <Text style={[styles.dayNum, isSelected && styles.dayTextSelected]}>{day.dayNum}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Refeições de Hoje</Text>
                {mealTypes.map(type => (
                    <View key={type}>
                        {renderMealSlot(type)}
                    </View>
                ))}

                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Resumo da Semana</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalMeals}</Text>
                            <Text style={styles.statLabel}>Refeições</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{Math.round(totals.calories)}</Text>
                            <Text style={styles.statLabel}>Kcal Totais</Text>
                        </View>
                    </View>
                    <View style={[styles.statsRow, { marginTop: 20 }]}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{Math.round(totals.protein)}g</Text>
                            <Text style={styles.statLabel}>Proteínas</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{Math.round(totals.carbs)}g</Text>
                            <Text style={styles.statLabel}>Carboidratos</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Escolha uma Receita</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* --- CHECKBOX DE REPETIR --- */}
                        <TouchableOpacity 
                            style={styles.checkboxContainer} 
                            onPress={() => setRepeatAllWeek(!repeatAllWeek)}
                        >
                            <Ionicons 
                                name={repeatAllWeek ? "checkbox" : "square-outline"} 
                                size={24} 
                                color="#D9682B" 
                            />
                            <View style={{marginLeft: 10}}>
                                <Text style={styles.checkboxTitle}>Repetir para a semana toda?</Text>
                                <Text style={styles.checkboxSubtitle}>
                                    Preencherá todos os {targetSlot.type}s desta semana.
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {/* --------------------------- */}

                        {favorites.length === 0 ? (
                            <Text style={styles.emptyText}>Você não tem favoritos salvos.</Text>
                        ) : (
                            <FlatList
                                data={favorites}
                                keyExtractor={item => String(item.id)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.favItem} onPress={() => addPlan(item)}>
                                        <Image 
                                            source={item.image ? { uri: item.image } : require('../assets/semImagem.jpeg')} 
                                            style={styles.favImage} 
                                        />
                                        <View>
                                            <Text style={styles.favName}>{item.name}</Text>
                                            <Text style={styles.favCal}>{item.calories} kcal</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: '#fff' 
    
    },
    monthTitle: { fontSize: 18, fontWeight: 'bold', color: '#D9682B', textTransform: 'capitalize' },
    
    weekStrip: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#fff', marginBottom: 10, elevation: 2 },
    dayItem: { alignItems: 'center', padding: 8, borderRadius: 10 },
    dayItemSelected: { backgroundColor: '#50D9B0' },
    dayName: { fontSize: 12, color: '#666', textTransform: 'uppercase' },
    dayNum: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dayTextSelected: { color: '#fff' },

    content: { padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },

    slot: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 10, minHeight: 80 },
    slotEmpty: { backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
    slotFilled: { backgroundColor: '#e3fff7ff', borderLeftWidth: 5, borderLeftColor: '#50D9B0', elevation: 1 },
    
    slotType: { fontSize: 12, color: '#666', marginBottom: 4, textTransform: 'uppercase' },
    addIcon: { position: 'absolute', right: 15 },
    
    recipeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    recipeCal: { fontSize: 12, color: '#666' },
    removeBtn: { padding: 10 },

    statsCard: { backgroundColor: '#ffffff', 
        borderRadius: 24, // Bordas bem arredondadas, estilo moderno
        paddingVertical: 45,
        paddingHorizontal: 20,
        marginTop: 15, 
        marginBottom: 100, // Margem grande para não bater na TabBar
        
        // Sombra estilo "Soft UI" / "Neumorphism" light
        shadowColor: "#D9682B", // Sombra levemente alaranjada para dar brilho
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10, // Sombra forte no Android
        
        borderWidth: 1,
        borderColor: '#f0f0f0', // Borda sutil para definição
    },

    statsTitle: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#1A1A1A', // Preto quase total para contraste
        marginBottom: 25, 
        textAlign: 'center',
        textTransform: 'uppercase', // Caixa alta dá ar de "sistema"
        letterSpacing: 1.5, // Espaçamento entre letras (muito usado em tech)
    },

    statsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        // O marginTop: 20 do segundo row já está inline no seu JSX, então não preciso por aqui
    },

    statItem: { 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
    },

    statValue: { 
        fontSize: 32, // Aumentei bastante o número
        fontWeight: '800', // Extra bold
        color: '#D9682B', // Laranja da marca
        marginBottom: 2,
        includeFontPadding: false, // Remove espaçamento extra do Android
        fontVariant: ['tabular-nums'], // Garante que números ocupem mesmo espaço (visual tech)
    },

    statLabel: { 
        fontSize: 11, 
        color: '#9E9E9E', // Cinza mais claro e moderno
        fontWeight: '600',
        textTransform: 'uppercase', // Label em caixa alta
        letterSpacing: 0.5,
    },

    statDivider: { 
        width: 1, 
        height: 40, // Linha mais alta
        backgroundColor: '#EEEEEE', // Divisor bem sutil
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    
    // Estilo do Checkbox
    checkboxContainer: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', 
        padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' 
    },
    checkboxTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
    checkboxSubtitle: { color: '#666', fontSize: 12 },

    favItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
    favImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
    favName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    favCal: { fontSize: 12, color: '#666' },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});