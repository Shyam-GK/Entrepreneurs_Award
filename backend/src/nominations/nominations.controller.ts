// X:\Projects\Entrepreneur\entrepreneur-award\src\nominations\nominations.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('nominations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Post()
  @Roles('user', 'admin')
  async create(@Body() dto: CreateNominationDto, @Request() req) {
    return this.nominationsService.create(req.user.id, dto);
  }

  @Get()
  @Roles('user', 'admin')
  async myNominations(@Request() req) {
    return this.nominationsService.findByNominator(req.user.id);
  }
}
