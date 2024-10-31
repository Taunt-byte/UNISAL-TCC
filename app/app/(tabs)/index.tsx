import { Image, StyleSheet, View, Dimensions } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import init from "react_native_mqtt"; // Importa o MQTT

// Inicializa a biblioteca MQTT
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default function HomeScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [temperature, setTemperature] = useState(null); // Estado para a temperatura
  const [humidity, setHumidity] = useState(null); // Estado para a umidade

  useEffect(() => {
    // Função de layout responsivo
    const updateLayout = () => {
      const screenWidth = Dimensions.get("window").width;
      setIsSmallScreen(screenWidth < 600);
    };
    const subscription = Dimensions.addEventListener("change", updateLayout);
    updateLayout();
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Configura a conexão MQTT
    const client = new Paho.MQTT.Client("IP_DO_SEU_BROKER_MQTT", Number(1883), "ReactNativeClient");

    client.onMessageArrived = (message) => {
      const data = JSON.parse(message.payloadString); // Parse JSON
      setTemperature(data.temperature); // Atualiza temperatura
      setHumidity(data.humidity); // Atualiza umidade
    };

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("Conexão perdida: " + responseObject.errorMessage);
      }
    };

    client.connect({
      onSuccess: () => {
        console.log("Conectado ao MQTT Broker");
        client.subscribe("caminho/do/topico"); // Assina o tópico onde os dados são publicados
      },
      onFailure: (err) => console.log("Erro ao conectar:", err),
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect(); // Desconecta ao desmontar
      }
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#F7E7CE", dark: "#3B2E2A" }}
      headerImage={
        <Image source={require("@/assets/images/incubator.png")} style={styles.incubatorImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bem-vindo à ChocaTech</ThemedText>
      </ThemedView>

      {/* Exibindo dados de temperatura e umidade */}
      <ThemedView style={styles.dataContainer}>
        <ThemedText type="subtitle">Temperatura Atual: {temperature ? `${temperature} °C` : "Carregando..."}</ThemedText>
        <ThemedText type="subtitle">Umidade Atual: {humidity ? `${humidity} %` : "Carregando..."}</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.stepsRow, isSmallScreen && styles.stepsColumn]}>
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}>
          <ThemedText type="subtitle">Passo 1: Conheça a Chocadeira</ThemedText>
          <ThemedText>
            Nossa chocadeira artesanal oferece a melhor experiência para a incubação de ovos, garantindo um ambiente controlado e seguro.
          </ThemedText>
        </View>
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}>
          <ThemedText type="subtitle">Passo 2: Explore os Recursos</ThemedText>
          <ThemedText>
            Descubra todas as funcionalidades que nossa chocadeira artesanal tem a oferecer, desde controle de temperatura até umidade.
          </ThemedText>
        </View>
        <View style={[styles.balloon, isSmallScreen && styles.balloonSmall]}>
          <ThemedText type="subtitle">Passo 3: Comece Agora</ThemedText>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  dataContainer: {
    padding: 16,
    alignItems: "center",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  stepsColumn: {
    flexDirection: "column",
    alignItems: "center",
  },
  balloon: {
    backgroundColor: "#483D8B",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: "30%",
    marginBottom: 16,
  },
  balloonSmall: {
    width: "90%",
  },
  incubatorImage: {
    height: 300,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
