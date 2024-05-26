#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Defina as credenciais da sua rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

// Defina as informações do seu broker MQTT
const char* mqtt_server = "IP_DO_SEU_BROKER_MQTT";
const int mqtt_port = 1883; // Porta padrão para MQTT

WiFiClient espClient;
PubSubClient client(espClient);

// Função de callback para mensagens recebidas
void callback(char* topic, byte* payload, unsigned int length) {
  // Lidere com as mensagens recebidas aqui, se necessário
}

void setup_wifi() {
  delay(10);
  // Conecta-se à rede Wi-Fi
  Serial.println();
  Serial.print("Conectando-se a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop até que estejamos reconectados
  while (!client.connected()) {
    Serial.print("Tentando conectar ao broker MQTT...");
    // Tentativa de conexão
    if (client.connect("ESP8266Client")) {
      Serial.println("Conectado");
      // Assine os tópicos necessários aqui, se necessário
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos");
      // Espera 5 segundos antes de tentar novamente
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  // Envie uma mensagem para o tópico MQTT desejado
  client.publish("caminho/do/topico", "mensagem_para_enviar");
  delay(5000); // Espere 5 segundos antes de enviar a próxima mensagem
}
