import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [temperatura, setTemperatura] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://192.168.0.123/dados'); // IP do ESP32
        setTemperatura(res.data.temperatura);
      } catch (err) {
        console.log('Erro ao conectar ao ESP32:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperatura:</Text>
      <Text style={styles.value}>{temperatura ?? 'Carregando...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  value: { fontSize: 32, fontWeight: 'bold' },
});
