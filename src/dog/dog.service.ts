import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog, DogType } from './dog.model';
import * as process from 'process';
import { MqttService } from '../services/mqtt.service';
import { FirebaseService } from '../services/firebase.service';
import { DeviceService } from '../device/device.service';

@Injectable()
export class DogService {
  private s3: S3;
  private mqttService: MqttService;

  constructor(
    @InjectModel('Dog') private readonly dogModel: Model<Dog>,
    private readonly firebaseService: FirebaseService,
    private readonly deviceService: DeviceService,
  ) {
    this.s3 = new S3({
      credentials: {
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
    });
    this.mqttService = new MqttService();
  }

  async sendNotificationToAllDevices() {
    const devices = await this.deviceService.getAllDevices();
    const deviceTokens = devices.map((device) => device.token);

    if (deviceTokens.length === 0) {
      return;
    }

    const payload = {
      tokens: deviceTokens,
      notification: {
        title: '🐶🛑Big dog alert!🐶🛑',
        body: 'A big dog has been created!',
      },
    };

    console.log('payload ', payload);

    return await this.firebaseService.sendEachForMulticast(payload);
  }

  async createDog(images, type) {
    const [sourceImage, bboxImage] = images;

    console.log('type ', type);

    if (type === DogType.BIG_DOG) {
      const mqttTopic = 'big-dog';
      const mqttMessage = 'A big dog has been created!';
      this.mqttService.publish(mqttTopic, mqttMessage);
      await this.sendNotificationToAllDevices();
    }

    const uploadBboxParams = {
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET,
      Key: `${type}/${bboxImage.originalname}`,
      Body: bboxImage.buffer,
    };

    const uploadSourceParams = {
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET,
      Key: `${type}/source/${sourceImage.originalname}`,
      Body: sourceImage.buffer,
    };

    const uploadedImage = await this.s3.upload(uploadBboxParams).promise();
    await this.s3.upload(uploadSourceParams).promise();

    const newDog = new this.dogModel({
      image: uploadedImage.Location,
      date: new Date(),
      type: type as DogType,
    });

    return newDog.save();
  }

  async getDogs(
    page = 1,
    limit = 10,
    type?: DogType,
  ): Promise<{ totalCount: number; dogs: Dog[] }> {
    const skip = (page - 1) * limit;
    const query = type ? { type } : {};

    const [dogs, totalCount] = await Promise.all([
      this.dogModel
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.dogModel.countDocuments(query).exec(),
    ]);

    return { totalCount, dogs };
  }
}
