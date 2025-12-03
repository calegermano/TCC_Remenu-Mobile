import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const BannerSection = ({ totalItems }) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800' }}
      style={styles.banner}
      imageStyle={styles.bannerImage}
    >
      <LinearGradient
        colors={['rgba(74, 111, 165, 0.9)', 'rgba(74, 111, 165, 0.7)']}
        style={styles.gradient}
      >
        <View style={styles.bannerContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="kitchen" size={40} color="#fff" />
          </View>
          
          <Text style={styles.bannerTitle}>Minha Geladeira</Text>
          <Text style={styles.bannerSubtitle}>
            Gerencie seus ingredientes e evite desperdícios
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalItems}</Text>
              <Text style={styles.statLabel}>Itens</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.statLabel}>Organizados</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <MaterialIcons name="calendar-today" size={20} color="#fff" />
              <Text style={styles.statLabel}>Validades</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 220,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default BannerSection;