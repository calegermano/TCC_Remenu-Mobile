// src/navigation/MainTabNavigator.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importando as telas
import FavoritesScreen from '../screens/FavoritesScreen';
import FridgeScreen from '../screens/FridgeScreen';
import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import RecipesScreen from '../screens/RecipesScreen';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Receitas') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Planejamento') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Geladeira') {
            iconName = focused ? 'fridge' : 'fridge';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D9682B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          
         
          height: 90,    
          paddingBottom: 40, 
          paddingTop: 10,   
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Receitas" 
        component={RecipesScreen}
      />
      <Tab.Screen 
        name="Favoritos" 
        component={FavoritesScreen}
      />
      <Tab.Screen 
        name="Planejamento" 
        component={PlanningScreen}
      />
      <Tab.Screen 
        name="Geladeira" 
        component={FridgeScreen}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;