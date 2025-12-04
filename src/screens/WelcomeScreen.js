// 1. Adicione 'Image' na importação
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F4F4" />

            <View style={styles.decorativeCircle} />

            <View style={styles.logoContainer}>
                {/* 
                   2. Componente de Imagem inserido AQUI.
                   Certifique-se de ter um arquivo 'logo.png' na pasta assets 
                   ou troque o caminho no require()
                */}
            <Image 
                source={require('../../assets/images/logo.png')} 
                style={styles.logoImage}
            />

                <Text style={styles.logoText}>REMENU<Text style={styles.dot}>.</Text></Text>
                <Text style={styles.subtitle}>
                   O sabor certo na hora certa
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.loginButton]} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>ACESSAR REMENU</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.registerButton]} 
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>CRIAR CONTA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F4F4F4', 
        padding: 24, 
        justifyContent: 'space-between',
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
    logoContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'flex-start' 
    },
    

    logoImage: {
        width: 100,   // Largura da imagem
        height: 100,  // Altura da imagem
        marginBottom: 25, // Espaço entre a imagem e o texto REMENU
        resizeMode: 'contain', // Garante que a imagem não distorça
        alignSelf: 'flex-start' 
    },

    logoText: { 
        fontSize: 52, 
        fontWeight: '900', 
        color: '#D9682B', 
        marginBottom: 5, 
        letterSpacing: -1, 
        lineHeight: 52,
    },
    dot: {
        color: '#D9682B', 
    },
    subtitle: { 
        fontSize: 18, 
        color: '#636363', // Ajustei levemente para contraste no fundo claro
        lineHeight: 26,
        fontWeight: '400',
    },
    buttonContainer: { 
        marginBottom: 40, 
        gap: 16 
    },
    button: { 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    loginButton: { 
        backgroundColor: '#D9682B',
        shadowColor: '#D9682B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // Levemente ajustado para fundo claro
        shadowRadius: 10,
        elevation: 8, 
    },
    loginText: { 
        color: '#fff', // Usei branco puro para melhor leitura no laranja
        fontSize: 16, 
        fontWeight: 'bold', 
        letterSpacing: 1, 
        textTransform: 'uppercase'
    },
    registerButton: { 
        backgroundColor: 'transparent', 
        borderWidth: 1.5, // Engrossei um pouco a borda
        borderColor: '#D9682B', 
    },
    registerText: { 
        color: '#D9682B', 
        fontSize: 16, 
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});