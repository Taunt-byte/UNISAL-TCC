#include <ESP8266WiFi.h>         // Biblioteca para a conexão Wi-Fi
#include <PubSubClient.h>        // Biblioteca para o protocolo MQTT
#include <Adafruit_Sensor.h>     // Biblioteca de suporte para sensores Adafruit
#include <DHT.h>                 // Biblioteca para sensores DHT
#include <DHT_U.h>               // Biblioteca adicional para sensores DHT
#include <Wire.h>                // Biblioteca para comunicação I2C
#include <LiquidCrystal_I2C.h>   // Biblioteca para LCD I2C

// Defina as credenciais da sua rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";       // Nome da rede Wi-Fi
const char* password = "SUA_SENHA_WIFI";  // Senha da rede Wi-Fi

// Definições do sensor DHT
#define DHTPIN D2         // Pino digital onde o DHT está conectado
#define DHTTYPE DHT11     // Tipo do sensor DHT (pode ser DHT11 ou DHT22)

// Defina as informações do seu broker MQTT
const char* mqtt_server = "IP_DO_SEU_BROKER_MQTT";  // Endereço IP do broker MQTT
const int mqtt_port = 1883;                         // Porta padrão para MQTT

WiFiClient espClient;               // Cliente Wi-Fi
PubSubClient client(espClient);     // Cliente MQTT usando o cliente Wi-Fi

// Função de callback para mensagens recebidas via MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  // Trate as mensagens recebidas aqui, se necessário
}

// Função para configurar a conexão Wi-Fi
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
  Serial.println(WiFi.localIP());  // Exibe o endereço IP obtido
}

// Função para reconectar ao broker MQTT se a conexão for perdida
void reconnect() {
  // Loop até que estejamos reconectados
  while (!client.connected()) {
    Serial.print("Tentando conectar ao broker MQTT...");
    // Tentativa de conexão
    if (client.connect("ESP8266Client")) {
      Serial.println("Conectado");
      // Inscreva-se nos tópicos necessários aqui, se necessário
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos");
      // Espera 5 segundos antes de tentar novamente
      delay(5000);
    }
  }
}

// Instanciação do sensor DHT e do LCD
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2); // Endereço I2C do LCD pode variar, verifique o seu

// Função de setup, executada uma vez na inicialização
void setup() {
  Serial.begin(115200);         // Inicializa a comunicação serial a 115200 bps
  setup_wifi();                 // Configura a conexão Wi-Fi
  client.setServer(mqtt_server, mqtt_port);  // Configura o servidor MQTT
  client.setCallback(callback);              // Define a função de callback MQTT
  dht.begin();                  // Inicializa o sensor DHT
  lcd.begin();                  // Inicializa o LCD
  lcd.backlight();              // Liga a luz de fundo do LCD
  lcd.print("Iniciando...");    // Exibe mensagem inicial no LCD
}

// Função de loop, executada continuamente
void loop() {
  if (!client.connected()) {
    reconnect();  // Reconecta ao broker MQTT se a conexão for perdida
  }
  
  client.loop();  // Mantém a conexão com o broker MQTT ativa

  delay(2000);    // Aguarda 2 segundos entre as leituras do sensor

  // Leitura de temperatura e umidade
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  // Verifica se houve falha nas leituras
  if (isnan(h) || isnan(t)) {
    Serial.println("Falha na leitura do sensor!");
    lcd.clear();
    lcd.print("Erro leitura");
    return;  // Sai da função loop() se houver erro na leitura
  }

  // Cria uma string para a mensagem MQTT
  char mensagem[50];
  snprintf(mensagem, 50, "Temperatura: %.2f C, Umidade: %.2f %%", t, h);

  // Envia uma mensagem para o tópico MQTT desejado
  client.publish("caminho/do/topico", mensagem);

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

  delay(5000);  // Aguarda 5 segundos antes de enviar a próxima mensagem
}
