import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

function PlanningScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planejamento</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>
          Seus planejamentos aparecerão aqui...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D9682B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PlanningScreen;