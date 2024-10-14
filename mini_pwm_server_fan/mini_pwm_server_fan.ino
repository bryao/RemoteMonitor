/*
  Wi-Fi Controlled Fan Speed Adjustment (ESP32 or similar board)

  This Arduino sketch creates a Wi-Fi server using the WiFiNINA library. 
  It allows controlling a fan's speed using a web-based HTTP request by sending 
  a PWM signal to the fan's pin. The board connects to a specified Wi-Fi network, 
  listens for incoming HTTP requests, and adjusts the fan speed based on the request.

  How it works:
  - Connects to a Wi-Fi network with predefined SSID and password.
  - Sets up a server that listens on port 80 for HTTP requests.
  - Clients can set the fan speed by sending a request in the format: 
    `/fanSpeed?value`, where `value` is the desired speed.
  - The board processes the request, extracts the fan speed, and controls the fan 
    using PWM on pin A2.
  - The device will automatically reconnect to Wi-Fi if the connection drops.

  Pin assignments:
  - Fan speed control (PWM output): Pin A2
  - On-board LED (to indicate activity): Pin 13
*/

#include <WiFiNINA.h>  // Include library to handle Wi-Fi functions

// Wi-Fi credentials
const char* ssid = "MICLab";              // Wi-Fi network name (SSID)
const char* password = "miclabedu2021";   // Wi-Fi password
IPAddress ip(192,168,0,163);              // Static IP address for the device

// Server setup
WiFiServer server(80);                    // HTTP server listening on port 80
WiFiClient client;                        // Wi-Fi client to handle connections

// Pin and control variables
const int fanSpeedPin = A2;               // Pin controlling fan speed (PWM)
int fanSpeed = 0;                         // Variable to hold the current fan speed

// Debug flag to enable/disable debug messages
bool debugEnabled = true;

// Function prototypes
void handleClientRequest();
void sendHttpResponse();
void reconnectWiFi();
void debugPrint(const String& message);
void debugPrintConnectionInfo();
void debugPrintFanSpeed(int speed);

// Setup function: Initializes the system
void setup() {
  Serial.begin(115200);                   // Start serial communication for debugging
  pinMode(fanSpeedPin, OUTPUT);           // Set the fan control pin as output
  pinMode(13, OUTPUT);                    // Set on-board LED pin as output (Pin 13)
  delay(10);                              // Small delay for stability

  // Wi-Fi connection
  debugPrint("Connecting to WiFi...");

  // Assign a static IP address to the device and start Wi-Fi connection
  WiFi.config(ip);
  WiFi.begin(ssid, password);

  // Wait until connected to the Wi-Fi network
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);                           // Wait for 500ms between attempts
    debugPrint(".");                      // Print dots to indicate connection progress
  }

  debugPrintConnectionInfo();             // Print connection info after successful connection

  // Start the HTTP server
  server.begin();
  debugPrint("HTTP server started");
}

// Main loop: Handles client requests and fan control
void loop() {
  // Indicate activity by turning on the on-board LED
  digitalWrite(13, HIGH);

  // Write the current fan speed to the PWM pin (A2)
  analogWrite(fanSpeedPin, fanSpeed);

  // Check if the device is still connected to Wi-Fi
  if (WiFi.status() != WL_CONNECTED) {
    reconnectWiFi();  // Attempt to reconnect if disconnected
  }

  // Check for client connections
  client = server.available();
  if (client) {
    handleClientRequest();  // Handle incoming client request
  }
}

// Function to handle incoming client requests
void handleClientRequest() {
  // Read the HTTP request from the client
  String request = client.readStringUntil('\r');
  client.flush();  // Clear the client buffer

  // Check if the request contains the fan speed parameter (`/fanSpeed?value`)
  if (request.indexOf("/fanSpeed?") != -1) {
    // Extract the fan speed value from the request
    int startPos = request.indexOf('=') + 1;
    int endPos = request.indexOf(' ', startPos);
    String fanSpeedStr = request.substring(startPos, endPos);
    fanSpeed = fanSpeedStr.toInt();  // Convert the fan speed string to an integer
    debugPrintFanSpeed(fanSpeed);    // Print the fan speed for debugging

    // Send an HTTP response to the client
    sendHttpResponse();
  }

  delay(1);  // Small delay to ensure proper communication timing
}

// Function to send an HTTP response back to the client
void sendHttpResponse() {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("Access-Control-Allow-Origin: *");  // Allow cross-origin requests (CORS)
  client.println("Connection: close");
  client.println("Content-Length: 0");  // Indicate no content body
  client.println();
}

// Function to handle Wi-Fi reconnection if the device disconnects
void reconnectWiFi() {
  debugPrint("Reconnecting to WiFi...");
  WiFi.begin(ssid, password);  // Reconnect to the Wi-Fi network
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);  // Retry connection every 500ms
    debugPrint(".");  // Print dots to indicate connection progress
  }
  debugPrint("\nReconnected to WiFi");
}

// Function to print debug messages if debugging is enabled
void debugPrint(const String& message) {
  if (debugEnabled) {
    Serial.print(message);
  }
}

// Function to print connection information after Wi-Fi connection
void debugPrintConnectionInfo() {
  debugPrint("\nWiFi connected\n");
  debugPrint("IP address: ");
  debugPrint(WiFi.localIP().toString());
  debugPrint("\n");
}

// Function to print the current fan speed for debugging purposes
void debugPrintFanSpeed(int speed) {
  debugPrint("Fan speed set to: ");
  debugPrint(String(speed));
  debugPrint("\n");
}
