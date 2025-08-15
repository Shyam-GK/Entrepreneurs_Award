// src/alumni/alumni.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumniDto } from './dto/create-alumni.dto';
import { UpdateAlumniProfileDto } from './dto/update-alumni-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { Express } from 'express'; // ✅ for Express.Multer.File type

import { AuthGuard } from '@nestjs/passport';

@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Post('register')
  async create(@Body() createAlumniDto: CreateAlumniDto) {
    return this.alumniService.create(createAlumniDto);
  }

  @Post(':id/profile/:userId')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateAlumniProfileDto,
  ) {
    return this.alumniService.updateProfile(id, userId, updateProfileDto);
  }

  @Post(':id/upload/:type/:userId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @Param('type')
    type: 'PHOTO' | 'REGISTRATION' | 'IPR' | 'MERGER' | 'AWARD' | 'ACADEMIC_COLLAB',
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,

  ) {
    return this.alumniService.uploadFile(id, userId, type, file);
  }

  @Get('uploads/:fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.alumniService.getFile(fileId);
    return res.sendFile(filePath, { root: '.' });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getAlumni(@Param('id') id: string) {
    return this.alumniService.getAlumni(id);
  }
}
