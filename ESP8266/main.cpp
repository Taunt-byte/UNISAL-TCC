#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "SUA_REDE";
const char* password = "SENHA";
WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  server.on("/dados", []() {
    server.send(200, "application/json", "{\"temperatura\": 26.5}");
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
