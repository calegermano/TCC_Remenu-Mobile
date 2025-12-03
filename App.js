// App.js - VERSÃO ATUALIZADA
import 'react-native-gesture-handler'; // DEVE SER A PRIMEIRA LINHA
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importe todas as telas
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Importe o Tab Navigator
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />

          {/* Fluxo de Autenticação */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Entrar', headerTintColor: '#D9682B' }} 
          />
          
          <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Criar Conta', headerTintColor: '#D9682B' }} 
          />

          <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Recuperar Senha', headerTintColor: '#D9682B' }} 
          />

          {/* Área Logada - Agora com Tab Navigation */}
          <Stack.Screen 
            name="Home" 
            component={MainTabNavigator} 
            options={{ headerShown: false }} 
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}