// App.js - VERSÃO ATUALIZADA
import 'react-native-gesture-handler'; // DEVE SER A PRIMEIRA LINHA

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Importe todas as telas
import FavoritesScreen from './src/screens/FavoritesScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import PlanningScreen from './src/screens/PlanningScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Importe o Tab Navigator e o Header Customizado
import CustomHeader from './src/components/CustomHeader';
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
            options={{ 
              
              header: (props) => <CustomHeader {...props} />,
              
              headerShown: true 
            }} 
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

          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'Meus Favoritos', headerTintColor: '#D9682B' }} 
          />

          <Stack.Screen 
            name="Planning" 
            component={PlanningScreen} 
            options={{ title: 'Planejamento', headerTintColor: '#D9682B' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}