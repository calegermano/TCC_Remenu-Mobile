import { Tabs } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
        tabBarActiveTintColor: '#4a6fa5',
        tabBarInactiveTintColor: '#666666',
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
      {/* 1. INÍCIO */}
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

      {/* 2. RECEITAS */}
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

      {/* 3. FAVORITOS */}
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "favorite" : "favorite-border"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      {/* 4. PLANEJAMENTO */}
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

      {/* 5. GELADEIRA */}
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
    </Tabs>
  );
}