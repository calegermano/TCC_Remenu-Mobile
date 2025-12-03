import { Tabs } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde o header padrão
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarActiveTintColor: '#4a6fa5', // Cor do ícone ativo
        tabBarInactiveTintColor: '#666666', // Cor do ícone inativo
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {/* Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "home" : "home"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Receitas */}
      <Tabs.Screen
        name="receitas"
        options={{
          title: 'Receitas',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "restaurant" : "restaurant"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Geladeira */}
      <Tabs.Screen
        name="geladeira"
        options={{
          title: 'Geladeira',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "kitchen" : "kitchen"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Planejamento */}
      <Tabs.Screen
        name="planejamento"
        options={{
          title: 'Planejamento',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "event-note" : "event-note"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}