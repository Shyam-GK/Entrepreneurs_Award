import { Controller, Get, Param, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }

  @Get(':id/download')
  async downloadProfile(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.profileService.generateProfilePDF(id);
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=${id}-profile.pdf`);
    res.header('Content-Length', buffer.length.toString());
    res.status(HttpStatus.OK).send(buffer); // Corrected call
  }
}