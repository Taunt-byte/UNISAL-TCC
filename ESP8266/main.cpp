#include <ESP8266WiFi.h>         // Biblioteca para a conexão Wi-Fi
#include <PubSubClient.h>        // Biblioteca para o protocolo MQTT
#include <Adafruit_Sensor.h>     // Biblioteca de suporte para sensores Adafruit
#include <DHT.h>                 // Biblioteca para sensores DHT
#include <DHT_U.h>               // Biblioteca adicional para sensores DHT

// Defina as credenciais da sua rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";       // Nome da rede Wi-Fi
const char* password = "SUA_SENHA_WIFI";  // Senha da rede Wi-Fi

// Configurações do sensor DHT
#define DHTPIN D2        // Pino digital onde o DHT está conectado
#define DHTTYPE DHT11    // Tipo do sensor DHT (DHT11 ou DHT22)
DHT dht(DHTPIN, DHTTYPE);

// Defina as informações do seu broker MQTT
const char* mqtt_server = "IP_DO_SEU_BROKER_MQTT";
const int mqtt_port = 1883;
const char* mqtt_topic = "caminho/do/topico";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando-se a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("WiFi conectado");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando ao broker MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("Conectado");
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  dht.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Lê os valores de temperatura e umidade
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Falha na leitura do sensor!");
    return;
  }

  // Formata os dados em JSON
  String jsonPayload = "{\"temperature\":" + String(t, 2) + ", \"humidity\":" + String(h, 2) + "}";

  // Publica os dados no tópico MQTT
  client.publish(mqtt_topic, jsonPayload.c_str());

  // Imprime no monitor serial para debug
  Serial.println("Dados enviados:");
  Serial.println(jsonPayload);

  delay(5000);  // Atraso de 5 segundos entre cada envio
}
