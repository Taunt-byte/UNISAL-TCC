import React from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Status da Chocadeira</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Temperatura</Text>
          <Text style={styles.value}>37.5°C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Umidade</Text>
          <Text style={styles.value}>55%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tempo restante</Text>
          <Text style={styles.value}>12 dias</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
