
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Defina as credenciais da sua rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";
#define DHTPIN D2 // Pino digital onde o DHT está conectado
#define DHTTYPE DHT11 // ou DHT22 dependendo do sensor

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
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2); // Endereço I2C do LCD pode variar, verifique o seu

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
  lcd.begin();
  lcd.backlight();
  lcd.print("Iniciando...");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  // Aguarde alguns segundos entre as leituras
  delay(2000);

  // Leitura de temperatura e umidade
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  // Verifica se houve falha nas leituras
  if (isnan(h) || isnan(t)) {
    Serial.println("Falha na leitura do sensor!");
    lcd.clear();
    lcd.print("Erro leitura");
    return;
  }
  // Envie uma mensagem para o tópico MQTT desejado
  client.publish("caminho/do/topico", "mensagem_para_enviar");
  delay(5000); // Espere 5 segundos antes de enviar a próxima mensagem

  // Imprime os resultados no Serial Monitor
  Serial.print("Umidade: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.println(" *C ");
  
  // Exibe os resultados no LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Umid: ");
  lcd.print(h);
  lcd.print(" %");
}