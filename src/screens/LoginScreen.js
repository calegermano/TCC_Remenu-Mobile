import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if(!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos');

        setLoading(true);
        try {
            // Envia para o Laravel
            const response = await api.post('/login', { email, senha });
            
            const { token, user } = response.data;

            // Salva o token no celular para não precisar logar de novo
            await AsyncStorage.setItem('@remenu_token', token);
            await AsyncStorage.setItem('@remenu_user', JSON.stringify(user));

            // Vai para a Home
            navigation.replace('Home'); 
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Login falhou. Verifique e-mail e senha.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="E-mail" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Senha" 
                value={senha} // Lembre-se que no seu backend é 'senha', mas aqui é variável de estado
                onChangeText={setSenha} 
                secureTextEntry 
            />

            {/* BOTÃO ESQUECI A SENHA */}
            <TouchableOpacity 
                style={{ alignSelf: 'flex-end', marginBottom: 20 }}
                onPress={() => navigation.navigate('ForgotPassword')}
            >
                <Text style={{ color: '#D9682B' }}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#D9682B', textAlign: 'center', marginBottom: 40 },
    input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15, fontSize: 16 },
    button: { height: 50, backgroundColor: '#D9682B', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});