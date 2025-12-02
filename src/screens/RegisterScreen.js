import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
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
            // Envia para o Laravel (AuthController -> register)
            const response = await api.post('/register', {
                nome: nome,
                email: email,
                senha: senha,
                senha_confirmation: confirmarSenha // O Laravel exige este campo para validar 'confirmed'
            });

            const { token, user } = response.data;

            // Salva e entra direto
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crie sua conta</Text>

            <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Senha (mín 6 caracteres)" value={senha} onChangeText={setSenha} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirmar Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Já tem conta? Faça Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#D9682B', marginBottom: 30, textAlign: 'center' },
    input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15, fontSize: 16 },
    button: { height: 50, backgroundColor: '#D9682B', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    linkText: { color: '#666', fontSize: 16 }
});