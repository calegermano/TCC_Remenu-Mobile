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
import api from '../services/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if(!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos');

        setLoading(true);
        try {
            console.log("Tentando login com:", email); // Log 1
            const response = await api.post('/login', { email, senha });
            
            // Log para ver o que o Laravel respondeu
            console.log("RESPOSTA DO LARAVEL:", response.data); 

            // Adapte aqui conforme o que aparecer no console. 
            // O padrão do Laravel Sanctum geralmente retorna 'token' ou 'access_token'
            const token = response.data.token || response.data.access_token;
            const user = response.data.user;

            if (!token) {
                Alert.alert("Erro", "O servidor não retornou um token válido.");
                return;
            }

            // Salvando com a mesma chave que o api.js busca (@remenu_token)
            await AsyncStorage.setItem('@remenu_token', token);
            await AsyncStorage.setItem('@remenu_user', JSON.stringify(user));

            console.log("✅ Token salvo no celular:", token);

            // Reseta a navegação para ir para a Home/Fridge
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }], // Certifique-se que o nome da rota no App.js é 'Home'
            });

        } catch (error) {
            console.log("Erro no Login:", error.response ? error.response.data : error);
            Alert.alert('Erro', 'Login falhou. Verifique e-mail e senha.');
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
    // NOVOS ESTILOS DO BOTÃO VOLTAR
    backButton: {
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'transparent', // Fundo transparente
        borderWidth: 1.5, // Borda Laranja
        borderColor: '#D9682B', 
        marginTop: 0 // Ajuste fino se necessário
    },
    backText: {
        color: '#D9682B', // Texto Laranja
        fontSize: 16, 
        fontWeight: 'bold', // Ou '600'
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});