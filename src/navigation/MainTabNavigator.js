// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importando as telas
import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PlanningScreen from '../screens/PlanningScreen';
import FridgeScreen from '../screens/FridgeScreen';

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
            iconName = focused ? 'kitchen' : 'kitchen';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D9682B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
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