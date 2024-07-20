import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F7E7CE', dark: '#3B2E2A' }}
      headerImage={
        <Image
          source={require('@/assets/images/incubator.png')}
          style={styles.incubatorImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bem-vindo à ChocaTech</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Passo 1: Conheça a Chocadeira</ThemedText>
        <ThemedText>
          Nossa chocadeira artesanal oferece a melhor experiência para a incubação de ovos, garantindo um ambiente controlado e seguro.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Passo 2: Explore os Recursos</ThemedText>
        <ThemedText>
          Descubra todas as funcionalidades que nossa chocadeira artesanal tem a oferecer, desde controle de temperatura até umidade.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Passo 3: Comece Agora</ThemedText>
        <ThemedText>
          Entre em contato conosco para adquirir sua chocadeira artesanal e iniciar seu projeto de incubação.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
  },
  incubatorImage: {
    height: 300,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
