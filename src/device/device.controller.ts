import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Device } from './device.model';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async getAllDevices(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Device[]> {
    // Assuming devices are already stored in the service.
    // You can implement pagination logic here using page and limit parameters.
    return this.deviceService.getAllDevices();
  }

  @Post()
  async addDevice(@Body() device: Device): Promise<Device> {
    return this.deviceService.addDevice(device);
  }
}
