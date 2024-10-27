import { Image, StyleSheet, View, Dimensions } from 'react-native'; // Importando componentes do React Native
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Componente personalizado de Parallax Scroll
import { ThemedText } from '@/components/ThemedText'; // Componente de texto com tema
import { ThemedView } from '@/components/ThemedView'; // Componente de view com tema
import { useEffect, useState } from 'react'; // Hooks para controle de estado e efeito

export default function HomeScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Estado para controlar se a tela é pequena

  useEffect(() => {
    // Função que será executada sempre que o layout mudar
    const updateLayout = () => {
      const screenWidth = Dimensions.get('window').width; // Obtém a largura da tela
      setIsSmallScreen(screenWidth < 600); // Define se a tela é pequena com base na largura (< 600 pixels)
    };

    // Adiciona um listener para monitorar mudanças no tamanho da tela
    const subscription = Dimensions.addEventListener('change', updateLayout);

    updateLayout(); // Chama a função para definir o layout inicial baseado no tamanho da tela

    // Remove o listener quando o componente for desmontado, prevenindo vazamento de memória
    return () => {
      subscription.remove(); // Remove o listener de eventos
    };
  }, []); // O array vazio [] garante que o efeito só seja executado uma vez, na montagem

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F7E7CE', dark: '#3B2E2A' }} // Define cores de fundo diferentes para modo claro e escuro
      headerImage={
        <Image
          source={require('@/assets/images/incubator.png')} // Imagem que será exibida no cabeçalho
          style={styles.incubatorImage} // Estilo aplicado à imagem
        />
      }>
      {/* Contêiner para o título da página */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bem-vindo à ChocaTech</ThemedText> {/* Título da tela */}
      </ThemedView>

      {/* Contêiner para os passos */}
      <ThemedView style={[styles.stepsRow, isSmallScreen && styles.stepsColumn]}> {/* Se a tela for pequena, aplica o estilo de coluna */}
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}> {/* Aplica estilo especial se for tela pequena */}
          <ThemedText type="subtitle">Passo 1: Conheça a Chocadeira</ThemedText> {/* Título do passo 1 */}
          <ThemedText>
            Nossa chocadeira artesanal oferece a melhor experiência para a incubação de ovos, garantindo um ambiente controlado e seguro.
          </ThemedText>
        </View>
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}> {/* Estilos aplicados ao segundo balão */}
          <ThemedText type="subtitle">Passo 2: Explore os Recursos</ThemedText> {/* Título do passo 2 */}
          <ThemedText>
            Descubra todas as funcionalidades que nossa chocadeira artesanal tem a oferecer, desde controle de temperatura até umidade.
          </ThemedText>
        </View>
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}> {/* Estilos aplicados ao terceiro balão */}
          <ThemedText type="subtitle">Passo 3: Comece Agora</ThemedText> {/* Título do passo 3 */}
          <ThemedText>
            Entre em contato conosco para adquirir sua chocadeira artesanal e iniciar seu projeto de incubação.
          </ThemedText>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row', // Coloca o conteúdo em linha
    alignItems: 'center', // Centraliza verticalmente os itens
    gap: 8, // Espaçamento entre os elementos no título
    padding: 16, // Padding ao redor do título
  },
  stepsRow: {
    flexDirection: 'row', // Mostra os passos lado a lado em telas grandes
    justifyContent: 'space-between', // Espaço entre os balões
    padding: 16, // Padding ao redor dos balões
  },
  stepsColumn: {
    flexDirection: 'column', // Alinha os passos um embaixo do outro em telas pequenas
    alignItems: 'center', // Centraliza os balões horizontalmente em telas pequenas
  },
  balloon: {
    backgroundColor: '#483D8B', // Cor de fundo dos balões
    padding: 16, // Padding dentro dos balões
    borderRadius: 16, // Arredondamento das bordas dos balões
    shadowColor: '#000', // Cor da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 8, // Raio da sombra
    elevation: 2, // Sombra para Android (elevation cria o efeito de elevação)
    width: '30%', // Cada balão ocupa 30% da largura em telas grandes
    marginBottom: 16, // Espaçamento inferior entre os balões em telas pequenas
  },
  balloonSmall: {
    width: '90%', // Em telas pequenas, os balões ocupam 90% da largura para melhor visualização
  },
  incubatorImage: {
    height: 300, // Altura da imagem
    width: '100%', // Imagem ocupa toda a largura
    bottom: 0, // A posição inferior da imagem
    left: 0, // A posição da imagem no lado esquerdo
    position: 'absolute', // Imagem fixa em relação ao contêiner do parallax
  },
});
