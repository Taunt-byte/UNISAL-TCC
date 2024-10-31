# Projeto de Chocadeira Automática

Status: Em desenvolvimento

---

Este projeto envolve a criação de uma chocadeira automática que monitora e controla a temperatura e a umidade para o processo de incubação de ovos. Utiliza um microcontrolador ESP8266 para coletar dados de um sensor DHT11 e enviar essas informações a um broker MQTT. Um aplicativo React Native exibe as condições em tempo real para o usuário, permitindo ajustes rápidos e monitoramento contínuo. 

---

## Sumário

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ESP8266](#configuração-do-esp8266)
- [Configuração do Aplicativo React Native](#configuração-do-aplicativo-react-native)
- [Como o Projeto Funciona](#como-o-projeto-funciona)
- [Processo de Incubação](#processo-de-incubação)
- [Materiais e Métodos](#materiais-e-métodos)
- [Execução do Projeto](#execução-do-projeto)
- [Referências](#referências)

---

## Visão Geral do Projeto

### Componentes:

- **ESP8266**: Coleta e envia dados de temperatura e umidade para o broker MQTT.
- **Broker MQTT**: Intermediário que transmite os dados do ESP8266 ao aplicativo.
- **Aplicativo React Native**: Exibe informações ao usuário e permite monitoramento em tempo real.

---

## Pré-requisitos

1. **Hardware**:
   - ESP8266
   - Sensor DHT11
   - Cabos e demais componentes para a montagem

2. **Software**:
   - [Arduino IDE](https://www.arduino.cc/en/software)
   - Bibliotecas: `ESP8266WiFi`, `PubSubClient`, `DHT`, `DHT_U`, `LiquidCrystal_I2C`
   - Broker MQTT (ex.: Mosquitto, HiveMQ)

---

## Configuração do ESP8266

Configurações essenciais para que o ESP8266 se conecte ao Wi-Fi, faça leituras do DHT11, e envie os dados para o broker MQTT. 

```cpp
// Inclusão das bibliotecas
#include <ESP8266WiFi.h> 
#include <PubSubClient.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

// Configurações de rede e broker MQTT
const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA";
const char* mqtt_server = "IP_DO_BROKER";
const char* mqtt_topic = "topico/temperatura";

// Funções e setup para conexão Wi-Fi e leitura do sensor
void setup() { /* configuração */ }
void loop() { /* leitura e publicação dos dados */ }
```

---

## Configuração do Aplicativo React Native

O aplicativo conecta-se ao broker MQTT e exibe as leituras de temperatura e umidade recebidas.

```javascript
import MQTT from "sp-react-native-mqtt";

// Função principal
export default function HomeScreen() { 
  /* Código para conexão, recebimento e exibição dos dados */
}
```

---

## Como o Projeto Funciona

1. **ESP8266** coleta e publica dados no broker MQTT.
2. **Broker MQTT** distribui os dados.
3. **Aplicativo React Native** conecta-se ao broker e exibe os dados em tempo real.

---

## Processo de Incubação

### Importância do Controle de Temperatura e Umidade

Temperatura e umidade controladas são essenciais para uma incubação saudável. Segundo Meyerhof (1992), temperaturas desuniformes podem causar mortalidade embrionária. 

Para ovos de galinha, recomenda-se uma umidade entre 55% e 65% e temperaturas entre 28 ºC e 30 ºC para garantir condições ideais de incubação.

---

## Materiais e Métodos

- **Ferramentas Utilizadas**:
  - **React Native** para o desenvolvimento do app móvel.
  - **ESP8266** como controlador principal.
  - **Módulo Ethernet W5100** para conectividade.
  - **Relé 12V e ventoinha 12V** para manter os níveis de umidade.
  - **Sensor DHT11** para monitoramento de temperatura e umidade.

---

## Execução do Projeto

1. **Configure o ESP8266** com suas credenciais de rede e detalhes do broker.
2. **Instale o broker MQTT** em sua rede ou use um serviço online.
3. **Execute o aplicativo React Native** em um dispositivo móvel na mesma rede.

---

## Referências

- Akhter, N. (2019). *Learning React Native*. O’Reilly Media.
- Barbosa, F. J. V., et al. (2007). *Sistema alternativo de criação de galinhas caipiras*. Embrapa.
- IBM. *Internet of Things* (IoT).