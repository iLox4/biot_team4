#include <dht.h>
#define dataPin 8 // Defines pin number to which the sensor is connected
dht DHT;

unsigned long previousMillis = 0;
long interval = 30000;

void setup() 
{
	Serial.begin(9600);
}

void loop()
{
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    int readData = DHT.read22(dataPin);

    float t = DHT.temperature; // Gets the values of the temperature
    float h = DHT.humidity; // Gets the values of the humidity

    // Printing the results on the serial monitor
    Serial.print("{\"temperature\":");
    Serial.print(t);
    Serial.print(",\"humidity\":");
    Serial.print(h);
    Serial.println("}");
  }
}