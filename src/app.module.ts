import { MongooseModule } from '@nestjs/mongoose';
import { DogSchema } from './dog/dog.model';
import { Module } from '@nestjs/common';
import { DogService } from './dog/dog.service';
import { DogController } from './dog/dog.controller';
import { ConfigModule } from '@nestjs/config';
import { MqttService } from './services/mqtt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/auth0.strategy';
import { FirebaseService } from './services/firebase.service';
import { DeviceModule } from './device/device.module';
import { DeviceService } from './device/device.service';
import { DeviceController } from './device/device.controller';
import { DeviceSchema } from './device/device.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: 'Dog', schema: DogSchema }]),
    MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
    DeviceModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DogController, DeviceController],
  providers: [
    DeviceService,
    DogService,
    MqttService,
    JwtStrategy,
    FirebaseService,
  ],
})
export class AppModule {}
