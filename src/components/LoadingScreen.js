import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

const LoadingScreen = ({ message = 'Carregando sua geladeira...' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de rotação
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animação de pulsação
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulse = pulseValue.interpolate({
    inputRange: [1, 1.1],
    outputRange: [1, 1.1],
  });

  const loadingTips = [
    'Organizando seus ingredientes...',
    'Verificando validades...',
    'Preparando sua geladeira...',
    'Carregando categorias...',
    'Sincronizando dados...',
  ];

  const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulse }] }]}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <MaterialIcons name="refresh" size={80} color="#4a6fa5" />
        </Animated.View>
      </Animated.View>

      <Text style={styles.title}>Remenu Geladeira</Text>
      <Text style={styles.message}>{message}</Text>
      
      <View style={styles.progressContainer}>
        <ActivityIndicator size="large" color="#4a6fa5" />
        <Text style={styles.tip}>{randomTip}</Text>
      </View>

      <View style={styles.loadingDots}>
        <Animated.View style={[styles.dot, { opacity: pulseValue }]} />
        <Animated.View style={[styles.dot, { opacity: pulseValue, animationDelay: '200ms' }]} />
        <Animated.View style={[styles.dot, { opacity: pulseValue, animationDelay: '400ms' }]} />
      </View>

      <View style={styles.hintContainer}>
        <MaterialIcons name="info" size={16} color="#666" />
        <Text style={styles.hint}>
          Dica: Você pode adicionar itens usando o botão "+" no canto inferior
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#4a6fa5',
    borderRadius: 5,
    opacity: 0.3,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    maxWidth: 300,
  },
  hint: {
    flex: 1,
    fontSize: 12,
    color: '#4a6fa5',
    lineHeight: 16,
  },
});

export default LoadingScreen;