// src/alumni/alumni.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NomineeDetails } from '../nominee-details/entities/nominee-details.entity';
import { Award } from '../nominee-details/entities/award.entity';
import { Ipr } from '../nominee-details/entities/ipr.entity';
import { Merger } from '../nominee-details/entities/merger.entity';
import { Collaboration } from '../nominee-details/entities/collaboration.entity';
import { UpdateNomineeDetailsDto } from '../nominee-details/dto/update-nominee-details.dto';
import { UsersService } from '../users/users.service';
import { NominationsService } from '../nominations/nominations.service';
import type { Express } from 'express'; // ✅ for Express.Multer.File type

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AlumniService {
  private readonly logger = new Logger(AlumniService.name);

  constructor(
    @InjectRepository(NomineeDetails)
    private nomineeDetailsRepository: Repository<NomineeDetails>,
    @InjectRepository(Award)
    private awardRepository: Repository<Award>,
    @InjectRepository(Ipr)
    private iprRepository: Repository<Ipr>,
    @InjectRepository(Merger)
    private mergerRepository: Repository<Merger>,
    @InjectRepository(Collaboration)
    private collaborationRepository: Repository<Collaboration>,
    private usersService: UsersService,
    private nominationsService: NominationsService,
  ) {}

  async create(dto: any) {
    // Implement create user logic if needed
    return { message: 'Alumni created', data: dto };
  }

  async updateProfile(
    id: string,
    userId: string,
    updateDto: UpdateNomineeDetailsDto,
  ): Promise<NomineeDetails> {
    const user = await this.usersService.findOne(id);
    if (!user || user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    let nomineeDetails = await this.nomineeDetailsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!nomineeDetails) {
      nomineeDetails = this.nomineeDetailsRepository.create({
        user: { id: userId },
      });
    }

    Object.assign(nomineeDetails, updateDto);
    const savedDetails = await this.nomineeDetailsRepository.save(
      nomineeDetails,
    );

    await this.nominationsService.updateNominationStatus(
      user.email,
      user.id,
    );

    return savedDetails;
  }

  private buildFilePath(
    type: string,
    id: string,
    originalName: string,
  ): string {
    const timestamp = Date.now();
    const cleanName = originalName.replace(/\s+/g, '_');
    return path.join(
      'uploads',
      type.toLowerCase(),
      id,
      `${cleanName}_${timestamp}${path.extname(originalName)}`,
    );
  }

  async uploadFile(
    id: string,
    userId: string,
    type: string,
    //file?: MulterFile,
    file?: Express.Multer.File, // ✅ correct type
  ): Promise<{ filePath: string }> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne(id);
    if (!user || user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const filePath = this.buildFilePath(type, id, file.originalname);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, file.buffer);

    // Here you can save filePath to nominee details or related entity

    return { filePath };
  }

  async getFile(fileId: string): Promise<string> {
    const searchPaths = [
      'uploads/photo',
      'uploads/registration',
      'uploads/ipr',
      'uploads/merger',
      'uploads/award',
      'uploads/academic_collab',
    ];

    for (const dir of searchPaths) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        if (file.name.includes(fileId)) {
          return path.join(dir, file.name);
        }
      }
    }
    throw new HttpException('File not found', HttpStatus.NOT_FOUND);
  }

  async getAlumni(id: string) {
    return this.nomineeDetailsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
