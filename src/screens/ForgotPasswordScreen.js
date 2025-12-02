import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        if (!email) return Alert.alert('Erro', 'Digite seu e-mail.');

        setLoading(true);
        try {
            await api.post('/forgot-password', { email });
            Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir a senha.', [
                { text: 'Voltar ao Login', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique se o endereço está correto.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>Digite seu e-mail para receber o link de redefinição.</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Seu e-mail cadastrado" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar Link</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
                <Text style={{color: '#666'}}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#D9682B', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
    input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 20, paddingHorizontal: 15 },
    button: { width: '100%', height: 50, backgroundColor: '#D9682B', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});