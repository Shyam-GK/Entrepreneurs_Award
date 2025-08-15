import { Controller, Get, Param, Query, Res, UseGuards, HttpStatus,NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import type { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { join, normalize } from 'path';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('nominee-details')
  async getNomineeDetailsList(@Query('email') email: string) {
    return this.adminService.getNomineeDetailsList(email);
  }

  @Get('nominee-details/:id')
  async getNomineeDetail(@Param('id') id: string) {
    console.log('Requested Nominee ID:', id);
    return this.adminService.getNomineeDetail(id);
  }

  @Get('nominee-details/:id/nominators')
  async getNominators(@Param('id') id: string) {
    return this.adminService.getNominators(id);
  }

  @Get('nominee-details/:id/download-application')
  async downloadApplication(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.adminService.generateApplicationPDF(id);
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=application-${id}.pdf`);
    res.header('Content-Length', buffer.length.toString());
    res.status(HttpStatus.OK).send(buffer);
  }

  @Get('uploads/:fileName')
  async getFile(@Param('fileName') fileName: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const normalizedPath = normalize(fileName).replace(/^(\.\.(\/|\\|$))+/g, '');
    const filePath = join(__dirname, '..', '..', 'uploads', normalizedPath);
    console.log('Requested file:', filePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }
    const file = fs.createReadStream(filePath);
    res.set({
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return new StreamableFile(file);
  }
}