// mqtt.service.ts
import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService {
  private mqttClient: mqtt.MqttClient;

  constructor() {
    this.connect();
  }

  private connect(): void {
    const brokerUrl = process.env.MQTT_BROKER_URL;
    const brokerPort = Number(process.env.MQTT_BROKER_PORT);
    const brokerUser = process.env.MQTT_BROKER_USER;
    const brokerPassword = process.env.MQTT_BROKER_PASSWORD;

    console.log('brokerUrl', brokerUrl, brokerPort, brokerUser, brokerPassword);

    const options: mqtt.IClientOptions = {
      clientId: 'nestjs-mqtt-client', // Provide a unique client ID
      username: brokerUser,
      keepalive: 0,
      password: brokerPassword,
      protocol: 'mqtts',
      host: brokerUrl,
      port: brokerPort,
    };

    this.mqttClient = mqtt.connect(options);

    this.mqttClient.on('error', (error) => {
      console.error('Error connecting to MQTT broker:', error);
    });
  }

  public publish(topic: string, message: string): void {
    this.mqttClient.publish(topic, message);
  }
}
