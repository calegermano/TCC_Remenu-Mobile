import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Se tiver o logo, use Image. Se não, use Text por enquanto */}
                <Text style={styles.logoText}>Remenu</Text>
                <Text style={styles.subtitle}>Receitas inteligentes para o seu dia a dia.</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.loginButton]} 
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>Já tenho conta</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.registerButton]} 
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>Criar nova conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'space-between' },
    logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoText: { fontSize: 48, fontWeight: 'bold', color: '#D9682B', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
    buttonContainer: { marginBottom: 50, gap: 15 },
    button: { height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    loginButton: { backgroundColor: '#D9682B' },
    loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    registerButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#D9682B' },
    registerText: { color: '#D9682B', fontSize: 18, fontWeight: 'bold' }
});