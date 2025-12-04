// App.js - VERSÃO ATUALIZADA
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'; // DEVE SER A PRIMEIRA LINHA
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importe todas as telas
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Importe o Tab Navigator e o Header Customizado
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          
          {/* --- TELAS DE AUTENTICAÇÃO (Sem Header) --- */}
          
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />


          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} // Removemos o título padrão
          />
          
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }} // Removemos o título padrão
          />

          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: false }} // Removemos o título padrão
          />

          {/* --- ÁREA LOGADA (Com CustomHeader) --- */}
          
          <Stack.Screen 
            name="Home" 
            component={MainTabNavigator} 
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="Recipes" 
            component={RecipesScreen} 
            options={{ title: 'Receitas', headerTintColor: '#D9682B' }} 
          />

          <Stack.Screen 
            name="RecipeDetails" 
            component={RecipeDetailsScreen} 
            options={{ title: 'Detalhes', headerTintColor: '#D9682B' }} 
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}