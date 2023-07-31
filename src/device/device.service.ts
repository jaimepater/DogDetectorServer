// device.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from './device.model';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  async getAllDevices(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async addDevice(device: Device): Promise<Device> {
    const existingDevice = await this.deviceModel
      .findOne({ token: device.token })
      .exec();

    if (existingDevice) {
      return existingDevice;
    }
    const newDevice = new this.deviceModel(device);
    return newDevice.save();
  }
}
