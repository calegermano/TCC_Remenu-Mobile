import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar,KeyboardAvoidingView,Platform} from 'react-native';
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
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />

            {/* Elemento Decorativo */}
            <View style={styles.decorativeCircle} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>RECUPERAR SENHA</Text>
                    <Text style={styles.subtitle}>
                        Não se preocupe. Digite seu e-mail para receber as instruções.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-MAIL CADASTRADO</Text>
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

                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleReset} 
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>ENVIAR LINK</Text>
                        )}
                    </TouchableOpacity>
                    
                    {/* Botão Cancelar (Outline Style) */}
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.cancelButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>CANCELAR</Text>
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
        fontSize: 38, // Grande e impactante
        fontWeight: '900', 
        color: '#D9682B', 
        letterSpacing: -1, 
        marginBottom: 10,
    },
    dot: {
        color: '#D9682B', 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#636363', 
        fontWeight: '400',
        lineHeight: 24
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
    // Botão Principal
    submitButton: { 
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
    submitButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    // Botão Secundário (Outline)
    cancelButton: { 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'transparent', 
        borderWidth: 1.5, 
        borderColor: '#ffffffff', 
    },
    cancelButtonText: { 
        color: '#D9682B', 
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});