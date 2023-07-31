import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DogService } from './dog.service';
import { DogType } from './dog.model';
import { BasicAuthGuard } from '../auth/basicAuth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('dog')
export class DogController {
  constructor(private readonly dogsService: DogService) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async createDog(
    @Body('type') type: string,
    @UploadedFiles() images,
    @Req() req,
    @Res() res,
  ) {
    try {
      const createdDog = await this.dogsService.createDog(images, type);
      return res.status(201).json(createdDog);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getDogs(
    @Query('page')
    page = 1,
    @Query('limit') limit = 10,
    @Req() req,
    @Res() res,
    @Query('type') type?: DogType,
  ) {
    try {
      const dogs = await this.dogsService.getDogs(page, limit, type);
      return res.status(200).json(dogs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
