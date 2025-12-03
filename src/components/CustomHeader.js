import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, SafeAreaView, Platform, Modal // 1. Importamos o Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomHeader({ navigation }) {
    // 2. Estado para controlar se o Modal está visível ou não
    const [modalVisible, setModalVisible] = useState(false);

    // Função que executa o Logout
    const confirmLogout = async () => {
        try {
            setModalVisible(false); // Fecha o modal
            await AsyncStorage.removeItem('@remenu_token');
            await AsyncStorage.removeItem('@remenu_user');
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.log('Erro ao sair:', error);
        }
    };

    return (
        <View style={styles.headerWrapper}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {/* --- MODAL DE CONFIRMAÇÃO CUSTOMIZADO --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Para fechar no botão 'voltar' do Android
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Ícone de Atenção */}
                        <View style={styles.iconCircle}>
                            <MaterialIcons name="logout" size={32} color="#D9682B" />
                        </View>

                        <Text style={styles.modalTitle}>SAIR DA CONTA?</Text>
                        <Text style={styles.modalMessage}>
                            Você precisará fazer login novamente para acessar suas receitas salvas.
                        </Text>

                        <View style={styles.modalActions}>
                            {/* Botão Cancelar */}
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]} 
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>CANCELAR</Text>
                            </TouchableOpacity>

                            {/* Botão Confirmar Sair */}
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]} 
                                onPress={confirmLogout}
                            >
                                <Text style={styles.confirmText}>SIM, SAIR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ---------------------------------------- */}

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    
                    {/* LADO ESQUERDO: Logo */}
                    <View style={styles.brandContainer}>
                        <Image 
                            source={require('../../assets/images/logo.png')} 
                            style={styles.logo} 
                        />
                        <Text style={styles.brandText}>
                            REMENU
                        </Text>
                    </View>

                    {/* LADO DIREITO: Botão de Perfil */}
                    <TouchableOpacity 
                        style={styles.profileButton}
                        activeOpacity={0.7}
                        // 3. Ao clicar, apenas abrimos o modal
                        onPress={() => setModalVisible(true)}
                    >
                        <MaterialIcons name="person" size={26} color="" />
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... Estilos do Header (Mantidos iguais) ...
    headerWrapper: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        zIndex: 10,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    safeArea: { backgroundColor: '#FFFFFF' },
    container: {
        height: 70, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logo: { width: 35, height: 35, resizeMode: 'contain' },
    brandText: { fontSize: 22, fontWeight: '900', color: '#D9682B', letterSpacing: -0.5 },
    profileButton: {
        width: 45, height: 45,
        backgroundColor: '#FFF0E6',
        borderRadius: 25,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#FFE0CC'
    },

    // --- NOVOS ESTILOS PARA O MODAL ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 16, 20, 0.7)', // Fundo escuro semi-transparente (estilo Glass)
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24, // Bordas bem arredondadas
        padding: 24,
        alignItems: 'center',
        // Sombra do Modal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF0E6', // Fundo laranja claro
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E2029',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    modalMessage: {
        fontSize: 14,
        color: '#8F9BB3',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    cancelText: {
        color: '#8F9BB3',
        fontWeight: 'bold',
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: '#D9682B', // Laranja Sólido
        shadowColor: '#D9682B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});