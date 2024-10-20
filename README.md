# Projeto de Chocadeira Automática

Status: Em desenvolvimento.

# Instalação

## Repositorio

## React Native

# Visão Geral

Segundo levantamento do USDA (Departamento de Agricultura dos Estados Unidos) divulgado em outubro de 2014, o Brasil se mantinha como o segundo maior produtor mundial de carne de frango, com produção prevista para 12,3 milhões de toneladas em 2014, demonstrando um mercado cada vez maior e com grande potencial econômico.

# Incubação de Ovos

## Processo de Incubação

A incubação de ovos é um processo crítico na avicultura, responsável pelo desenvolvimento embrionário e eclosão de aves. Este processo pode ser realizado de forma natural ou artificialmente, em incubadoras controladas. A incubação artificial é amplamente utilizada na produção comercial de aves devido à sua eficiência e capacidade de aumentar a produtividade. As incubadoras artificiais são equipamentos projetados para manter condições ideais para o desenvolvimento dos embriões.

## Importância da Temperatura e Umidade

O período de incubação dos ovos é um momento crítico, principalmente por causa da temperatura. Segundo Meyerhof (1992), citado por Calil (2007), temperaturas desuniformes podem causar mortalidade embrionária no início do processo de incubação. A temperatura e a umidade variam conforme a espécie de ave. Para garantir o desenvolvimento saudável dos ovos de galinha, é essencial submetê-los a condições precisas de incubação durante um período de 21 dias, conforme descrito por North e Bell (1990).

De acordo com Barbosa et al. (2007), a umidade relativa interna ideal varia entre 55% e 65% para ovos incubados em chocadeiras. Isso é cuidadosamente monitorado e mantido utilizando um termômetro de bulbo úmido, com uma faixa de temperatura entre 28 ºC e 30 ºC. Manter essa faixa de umidade é essencial para evitar complicações no desenvolvimento embrionário e garantir a eclosão saudável dos ovos. Outro aspecto importante é a viragem dos ovos, que precisa ser realizada a cada 2 horas.

# Materiais e Métodos

## Ferramentas Utilizadas

Neste projeto, utilizamos diversas ferramentas para a construção da chocadeira automática, incluindo:

- **React Native**: Framework de desenvolvimento de aplicativos móveis, utilizando a linguagem de programação JavaScript e a biblioteca React.
- **ESP8266**: Componente central da chocadeira automática, atuando como o núcleo do sistema.
- **Módulo Ethernet W5100**: Proporciona conectividade Ethernet ao ESP8266.
- **Módulo Relé 12V 10A (2 Canais)**: Controle preciso dos dispositivos.
- **Ventoinha 12V (3 Fios)**: Controla e mantém os níveis de umidade no interior da chocadeira.
- **Sensor de Temperatura e Umidade DHT11**: Medição precisa de umidade e temperatura.
- **Display LCD 16x2**: Interface de visualização para acompanhamento das informações essenciais do processo de incubação.

# Programação do ESP8266

## Bibliotecas Utilizadas 

```cpp
#include <ESP8266WiFi.h> // Biblioteca para a conexão Wi-Fi
#include <PubSubClient.h> // Biblioteca para o protocolo MQTT
#include <Adafruit_Sensor.h> // Biblioteca de suporte para sensores
#include <DHT.h> // Biblioteca para sensores DHT
#include <DHT_U.h> // Biblioteca adicional para sensores DHT
#include <Wire.h> // Biblioteca para comunicação I2C
#include <LiquidCrystal_I2C.h> // Biblioteca para LCD I2C
```

## Resultados Esperados

O desenvolvimento de uma chocadeira automatizada utilizando o ESP8266, aliado à criação de um aplicativo para dispositivos móveis, representa uma aplicação prática e inovadora dos conhecimentos adquiridos na faculdade. Espera-se criar uma máquina capaz de realizar a incubação de ovos e trazer aves saudáveis no processo.

Os resultados esperados em relação ao aplicativo móvel são rapidez na verificação dos status dos ovos armazenados e portabilidade, além de uma interface de fácil compreensão.

## Referências

- Akhter, N. (2019). Learning React Native: Building Native Mobile Apps with JavaScript. O’Reilly Media.
- Barbosa, F. J. V., et al. (2007). Sistema alternativo de criação de galinhas caipiras. Teresina: Embrapa Meio-Norte.
- Calil, T. A. C. (2007). Princípios básicos de Incubação. In: Anais da Conferência Apinco.
- Cisco. What is the Internet of Things (IoT)?. Retrieved from [Cisco](https://www.cisco.com/c/en/us/solutions/internet-of-things/overview.html).
- IBM. Internet of Things. Retrieved from [IBM](https://www.ibm.com/br-pt/topics/internet-of-things).
- IBM. What is IoT in Agriculture?. Retrieved from [IBM](https://www.ibm.com/blog/what-is-iot-in-agriculture).
- Kumar, A., & Singh, R. K. (2016). Comparative analysis of angularjs and reactjs. International Journal of Latest Trends in Engineering and Technology, 7(4), 225–227.
- North, M. O., & Bell, D. D. (1990). Commercial chicken production manual. Ontario: Library of Congress.
- Parashar, N., & Rajan, N. (2020). React Native Cookbook: Bringing the Web to Native Platforms. Packt Publishing.
- Proakis, J. G., & Manolakis, D. G. (2006). Digital Signal Processing: Principles, Algorithms, and Applications. 4th ed. Boston: Pearson.
- Schwartz, M. (2016). Internet of Things with ESP8266. Packt Publishing.