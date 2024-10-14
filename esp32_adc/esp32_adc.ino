/*
  This file is an Arduino sketch for the ESP32 microcontroller that connects to a Wi-Fi network, communicates with an ADS1115 Analog-to-Digital Converter (ADC), and sets up a TCP server.
  The main purpose of this code is to read analog data from a sensor via the ADS1115 ADC, process it, and send it to connected clients over a Wi-Fi network.

  Key Functionalities:
  1. Wi-Fi Connection: The ESP32 connects to a Wi-Fi network using the provided SSID and password.
  2. ADC Setup: The ADS1115 is used to measure analog input and convert it into a digital value.
  3. Interrupt Handling: An interrupt is used to know when new ADC data is available for reading.
  4. TCP Server: A TCP server is set up on port 8888, allowing remote clients to connect and receive sensor data in real-time.
  5. Data Acquisition: The main loop reads the ADC data, converts it to voltage, and transmits it to connected clients.
*/

#include <WiFi.h>
#include <Adafruit_ADS1X15.h>

// WiFi credentials
const char* ssid = "";  // Wi-Fi SSID (network name)
const char* password = "";  // Wi-Fi password

// I2C and ADC configuration
constexpr int READY_PIN = 2;  // Pin number for data ready signal from ADS1115
int clockFrequency = 100000;  // I2C clock frequency for communicating with the ADS1115
Adafruit_ADS1X15 ads;  // Create an instance of the ADS1115 ADC
#define RATE_ADS1115_250SPS (0x00A0)  // Data rate for the ADC (250 samples per second)

// TCP Server setup
WiFiServer server(8888);  // Set up a TCP server on port 8888

// ADC data variables
int16_t adc0;  // Variable to hold raw ADC value from channel 0
float volts0;  // Variable to hold converted voltage from ADC value
float displacement_filteredValue = 0.0;  // Filtered value for displacement
byte displacement_data_buffer[4];  // Buffer to hold displacement data

// Interrupt handling
#ifndef IRAM_ATTR
#define IRAM_ATTR
#endif
volatile bool new_data = false;  // Flag to indicate when new data is ready from ADC

// Interrupt Service Routine (ISR) to set the new_data flag when data is ready
void IRAM_ATTR NewDataReadyISR() {
  new_data = true;
}

void setup() {
  setupSerial();  // Setup serial communication for debugging
  setupI2C();  // Setup I2C and initialize ADC
  setupWiFi();  // Setup Wi-Fi connection
  setupServer();  // Setup TCP server
}

void loop() {
  handleClientConnections();  // Handle client connections and send data
}

// Debug information setup
void setupSerial() {
  Serial.begin(115200);  // Start serial communication at 115200 baud rate
}

// I2C and ADC setup
void setupI2C() {
  Wire.setClock(clockFrequency);  // Set I2C clock frequency
  ads.setGain(GAIN_ONE);  // Set gain for the ADC (1x gain for full scale)
  delay(10);  // Small delay to ensure ADC is ready

  // Initialize the ADS1115 ADC
  if (!ads.begin()) {
    Serial.println("Failed to init ADS.");
    while (1);  // Stay in infinite loop if ADC initialization fails
  }

  ads.setDataRate(RATE_ADS1115_250SPS);  // Set data rate for the ADC
  pinMode(READY_PIN, INPUT);  // Set the ready pin as an input to monitor data readiness from ADS1115
  attachInterrupt(digitalPinToInterrupt(READY_PIN), NewDataReadyISR, FALLING);  // Attach interrupt for data readiness

  // Start continuous conversions.
  ads.startADCReading(ADS1X15_REG_CONFIG_MUX_DIFF_0_1, /*continuous=*/true);
}

// Wi-Fi connection setup
void setupWiFi() {
  WiFi.begin(ssid, password);  // Start Wi-Fi connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");  // Print dot while waiting for Wi-Fi connection
  }
  Serial.println("\nWiFi connected.");
}

// TCP server setup
void setupServer() {
  server.begin();  // Start the TCP server to listen for incoming connections
  Serial.println("Server started on port 8888");
}

// Handle client connections and send ADC data
void handleClientConnections() {
  WiFiClient client = server.available();  // Check if there is a client connected to the server
  if (client) {
    Serial.println("New Client Connected");

    // Wait for new data from the ADS1115
    while (client.connected()) {
      while (!new_data);  // Wait until new data is available
      new_data = false;  // Reset the flag

      // Read the ADC value from channel 0
      displacement_adc0 = ads.getLastConversionResults();
      displacement_filteredValue = displacement_adc0;

      // Prepare the data buffer for sending
      uint32_t temp;
      memcpy(&temp, &displacement_filteredValue, sizeof(float));
      displacement_data_buffer[0] = (temp >> 24) & 0xFF;
      displacement_data_buffer[1] = (temp >> 16) & 0xFF;
      displacement_data_buffer[2] = (temp >> 8) & 0xFF;
      displacement_data_buffer[3] = temp & 0xFF;

      // Send the displacement data to the connected client
      client.write(displacement_data_buffer, 4);
    }

    // Close the connection if client disconnects
    Serial.println("Client Disconnected");
    client.stop();
  }
}