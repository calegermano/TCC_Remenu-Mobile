import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../services/api'; // Certifique-se que o caminho está certo

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if(!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos');

        setLoading(true);
        try {
            console.log("1. Enviando dados para login...");
            
            // --- CORREÇÃO 1: Mapear 'senha' para 'password' ---
            // O Laravel geralmente espera 'password', não 'senha'
            const response = await api.post('/login', { 
                email: email, 
                senha: senha 
            });
            
            console.log("2. Resposta recebida:", response.status); 

            // Pega o token (suporta diferentes formatos de retorno)
            const token = response.data.token || response.data.access_token;
            const user = response.data.user;

            if (!token) {
                Alert.alert("Erro", "O servidor não retornou um token válido.");
                setLoading(false);
                return;
            }

            // --- CORREÇÃO 2: A SALVAÇÃO DO TOKEN ---
            
            // Passo A: Salva no armazenamento do celular
            await AsyncStorage.setItem('@remenu_token', token);
            if(user) {
                await AsyncStorage.setItem('@remenu_user', JSON.stringify(user));
            }

            // Passo B: INJETA O TOKEN NO AXIOS IMEDIATAMENTE
            // Isso garante que a próxima requisição (Geladeira) JÁ tenha o token
            // sem depender do delay do interceptor.
            api.defaults.headers.Authorization = `Bearer ${token}`;

            console.log("3. Token salvo e cabeçalho configurado. Navegando...");

            // Passo C: Navega somente agora
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }], // Verifique se no seu App.js o nome é 'Home' ou 'Main'
            });

        } catch (error) {
            console.error("Erro no Login:", error);
            if (error.response) {
                console.log("Dados do erro:", error.response.data);
                Alert.alert('Falha', error.response.data.message || 'Verifique suas credenciais.');
            } else if (error.request) {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique o IP.');
            } else {
                Alert.alert('Erro', 'Ocorreu um erro inesperado.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />

            <View style={styles.decorativeCircle} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>LOGIN<Text style={styles.dot}>.</Text></Text>
                    <Text style={styles.subtitle}>Bem-vindo de volta</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-MAIL</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="seu@email.com"
                            placeholderTextColor="#999"
                            value={email} 
                            onChangeText={setEmail} 
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>SENHA</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Sua senha" 
                            placeholderTextColor="#999"
                            value={senha} 
                            onChangeText={setSenha} 
                            secureTextEntry 
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.forgotButton}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={handleLogin} 
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginText}>ENTRAR</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.backButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Welcome')}
                    >
                        <Text style={styles.backText}>VOLTAR</Text>
                    </TouchableOpacity>
                </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 40,
    },
    title: { 
        fontSize: 42, 
        fontWeight: '900', 
        color: '#D9682B', 
        letterSpacing: -1, 
        marginBottom: 5,
    },
    dot: {
        color: '#D9682B', 
    },
    subtitle: { 
        fontSize: 18, 
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
    forgotButton: { 
        alignSelf: 'flex-end', 
        marginBottom: 10 
    },
    forgotText: { 
        color: '#636363',
        fontWeight: '600',
        fontSize: 14
    },
    loginButton: { 
        height: 56, 
        backgroundColor: '#D9682B', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: '#D9682B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    loginText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    backButton: {
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#D9682B', 
        marginTop: 0
    },
    backText: {
        color: '#D9682B',
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});