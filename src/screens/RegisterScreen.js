import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { 
    ActivityIndicator, 
    Alert, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    StatusBar,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!nome || !email || !senha || !confirmarSenha) {
            return Alert.alert('Erro', 'Preencha todos os campos.');
        }

        if (senha !== confirmarSenha) {
            return Alert.alert('Erro', 'As senhas não coincidem.');
        }

        setLoading(true);
        try {
            const response = await api.post('/register', {
                nome: nome,
                email: email,
                senha: senha,
                senha_confirmation: confirmarSenha
            });

            const { token, user } = response.data;

            await AsyncStorage.setItem('@remenu_token', token);
            await AsyncStorage.setItem('@remenu_user', JSON.stringify(user));

            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            navigation.replace('Home');

        } catch (error) {
            console.log(error.response?.data);
            const msg = error.response?.data?.message || 'Não foi possível criar a conta.';
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />

            {/* Elemento Decorativo */}
            <View style={styles.decorativeCircle} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>CADASTRO<Text style={styles.dot}>.</Text></Text>
                        <Text style={styles.subtitle}>Crie sua conta e comece a cozinhar.</Text>
                    </View>

                    <View style={styles.form}>
                        
                        {/* INPUT NOME */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>NOME</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Como você quer ser chamado?" 
                                placeholderTextColor="#999"
                                value={nome} 
                                onChangeText={setNome} 
                            />
                        </View>

                        {/* INPUT EMAIL */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>E-MAIL</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="seu@email.com" 
                                placeholderTextColor="#999"
                                value={email} 
                                onChangeText={setEmail} 
                                keyboardType="email-address" 
                                autoCapitalize="none" 
                            />
                        </View>

                        {/* INPUT SENHA */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>SENHA</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Mínimo 8 caracteres" 
                                placeholderTextColor="#999"
                                value={senha} 
                                onChangeText={setSenha} 
                                secureTextEntry 
                            />
                        </View>

                        {/* INPUT CONFIRMAR SENHA */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CONFIRMAR SENHA</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Digite a senha novamente" 
                                placeholderTextColor="#999"
                                value={confirmarSenha} 
                                onChangeText={setConfirmarSenha} 
                                secureTextEntry 
                            />
                        </View>

                        {/* BOTÃO CADASTRAR */}
                        <TouchableOpacity 
                            style={styles.registerButton} 
                            onPress={handleRegister} 
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#F4F4F4" /> 
                            ) : (
                                <Text style={styles.registerButtonText}>FINALIZAR CADASTRO</Text>
                            )}
                        </TouchableOpacity>

                        {/* BOTÃO VOLTAR (Outline Style) */}
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Login')} 
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backButtonText}>VOLTAR AO LOGIN</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F4F4F4', 
        position: 'relative'
    },
    decorativeCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#D9682B',
        opacity: 0.1, 
        transform: [{ scale: 1.5 }],
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40 // Espaço extra no final do scroll
    },
    header: {
        marginTop: 40,
        marginBottom: 30,
    },
    title: { 
        fontSize: 38, // Um pouco menor que o Welcome para caber "CADASTRO"
        fontWeight: '900', 
        color: '#D9682B', 
        letterSpacing: -1, 
        marginBottom: 5,
    },
    dot: {
        color: '#D9682B', 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#636363', 
        fontWeight: '400',
    },
    form: {
        gap: 20, 
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D9682B',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginLeft: 4
    },
    input: { 
        height: 56, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    // Botão Principal (Sólido)
    registerButton: { 
        height: 56, 
        backgroundColor: '#D9682B', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#D9682B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    registerButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', 
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    // Botão Secundário (Outline)
    backButton: { 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'transparent', 
        borderWidth: 1.5, 
        borderColor: '#D9682B', 
    },
    backButtonText: { 
        color: '#D9682B', 
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});