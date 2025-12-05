import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Verifique se o IP está correto!
const api = axios.create({
    baseURL: 'http://192.168.15.104:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// --- O SEGREDO ESTÁ AQUI ---
// Antes de cada requisição, esse código roda para injetar o Token
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@remenu_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("✅ Token enviado na requisição:", config.url);
        } else {
            console.log("⚠️ Nenhum token encontrado no AsyncStorage");
        }
    } catch (error) {
        console.error("Erro ao pegar token", error);
    }
    return config;
});

export default api;