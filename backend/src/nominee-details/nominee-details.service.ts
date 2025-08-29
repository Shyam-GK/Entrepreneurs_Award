import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as TypeormLike } from 'typeorm';
import { NomineeDetails } from './entities/nominee-details.entity';
import { Award } from './entities/award.entity';
import { Ipr } from './entities/ipr.entity';
import { Merger } from './entities/merger.entity';
import { Collaboration } from './entities/collaboration.entity';
import { GraduationDetail } from './entities/graduation-detail.entity';
import { UpdateNomineeDetailsDto } from './dto/update-nominee-details.dto';
import { CreateAwardDto } from './dto/create-award.dto';
import { CreateIprDto } from './dto/create-ipr.dto';
import { CreateMergerDto } from './dto/create-merger.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { CreateGraduationDetailDto } from './dto/create-graduation-detail.dto';
import * as fs from 'fs';
import * as path from 'path';
import { NominationsService } from '../nominations/nominations.service';
import type { Express } from 'express';
import { User } from '../users/entities/user.entity';

function toRelUnix(p: string) {
  const rel = path.relative(process.cwd(), p);
  return rel.split(path.sep).join('/');
}

@Injectable()
export class NomineeDetailsService {
  constructor(
    @InjectRepository(NomineeDetails) private readonly nomineeRepo: Repository<NomineeDetails>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Award) private readonly awardRepo: Repository<Award>,
    @InjectRepository(Ipr) private readonly iprRepo: Repository<Ipr>,
    @InjectRepository(Merger) private readonly mergerRepo: Repository<Merger>,
    @InjectRepository(Collaboration) private readonly collabRepo: Repository<Collaboration>,
    @InjectRepository(GraduationDetail) private readonly graduationRepo: Repository<GraduationDetail>,
    private readonly nominationsService: NominationsService,
  ) {}

  async findOrCreateNomineeDetailsForUser(userId: string): Promise<NomineeDetails> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let nominee = await this.nomineeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!nominee) {
      nominee = this.nomineeRepo.create({ user: { id: userId } as any });
      nominee = await this.nomineeRepo.save(nominee);
    }

    return nominee;
  }

  async getMyStatus(userId: string) {
    const nominee = await this.nomineeRepo.findOne({
      where: { user: { id: userId } },
    });
    const hasProfile = !!nominee;
    return { hasProfile };
  }

  async updateMyNomineeDetails(userId: string, dto: UpdateNomineeDetailsDto): Promise<NomineeDetails> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    let nominee = await this.nomineeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!nominee) {
      nominee = this.nomineeRepo.create({
        user: { id: userId } as any,
        ...dto,
      });
    } else {
      Object.assign(nominee, dto);
    }

    const saved = await this.nomineeRepo.save(nominee);

    if (!user.isSubmitted) {
      user.isSubmitted = true;
      await this.userRepo.save(user);
    }

    if (saved?.user?.email) {
      await this.nominationsService.updateNominationStatus(saved.user.email, saved.user.id);
    }

    return saved;
  }

  private async findNomineeOwnedByUser(nomineeId: string, userId: string): Promise<NomineeDetails> {
    const nominee = await this.nomineeRepo.findOne({
      where: { id: nomineeId, user: { id: userId } },
      relations: ['user'],
    });
    if (!nominee) throw new NotFoundException('Nominee not found');
    if (nominee.user.id !== userId) throw new ForbiddenException('Not authorized');
    return nominee;
  }

  async uploadFileForUser(
    userId: string,
    type: 'photo' | 'registration',
    file?: Express.Multer.File,
  ) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    if (!file) return { message: 'No file uploaded, skipping' };

    const relPath = toRelUnix(file.path);
    if (type === 'photo') nominee.photo = relPath;
    else if (type === 'registration') nominee.registrationCertificate = relPath;
    else throw new HttpException('Invalid upload type', HttpStatus.BAD_REQUEST);

    const saved = await this.nomineeRepo.save(nominee);

    if (saved.user?.email) {
      await this.nominationsService.updateNominationStatus(saved.user.email, saved.user.id);
    }

    return { filePath: relPath };
  }

  async addAwardForUser(userId: string, dto: CreateAwardDto, file: Express.Multer.File) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    const award = this.awardRepo.create({
      ...dto,
      nominee,
    });
    if (file) {
      award.filePath = toRelUnix(file.path);
    } else {
      console.log('No file for award, skipping filePath');
    }

    nominee.hasAwards = true;
    await this.nomineeRepo.save(nominee);

    if (nominee.user?.email) {
      await this.nominationsService.updateNominationStatus(nominee.user.email, nominee.user.id);
    }

    return this.awardRepo.save(award);
  }

  async addIprForUser(userId: string, dto: CreateIprDto, file: Express.Multer.File) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    const ipr = this.iprRepo.create({
      ...dto,
      nominee,
    });
    if (file) {
      ipr.filePath = toRelUnix(file.path);
    } else {
      console.log('No file for IPR, skipping filePath');
    }
    return this.iprRepo.save(ipr);
  }

  async addGraduationDetailForUser(userId: string, dto: CreateGraduationDetailDto) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    const graduation = this.graduationRepo.create({
      ...dto,
      nominee,
    });
    return this.graduationRepo.save(graduation);
  }

  async addMergerForUser(userId: string, dto: CreateMergerDto, file: Express.Multer.File) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    const merger = this.mergerRepo.create({
      ...dto,
      nominee,
    });
    if (file) {
      merger.filePath = toRelUnix(file.path);
    } else {
      console.log('No file for merger, skipping filePath');
    }
    return this.mergerRepo.save(merger);
  }

  async addCollaborationForUser(userId: string, dto: CreateCollaborationDto, file: Express.Multer.File) {
    const nominee = await this.findOrCreateNomineeDetailsForUser(userId);
    const collab = this.collabRepo.create({
      ...dto,
      nominee,
    });
    if (file) {
      collab.filePath = toRelUnix(file.path);
    } else {
      console.log('No file for collaboration, skipping filePath');
    }
    return this.collabRepo.save(collab);
  }

  async getFile(fileId: string): Promise<StreamableFile> {
    const searchPattern = TypeormLike(`%${fileId}%`);

    const nd = await this.nomineeRepo.findOne({
      where: [{ photo: searchPattern }, { registrationCertificate: searchPattern }],
    });
    if (nd) {
      const match =
        (nd.photo && nd.photo.includes(fileId) && nd.photo) ||
        (nd.registrationCertificate && nd.registrationCertificate.includes(fileId) && nd.registrationCertificate);

      if (match) {
        const abs = path.isAbsolute(match) ? match : path.resolve(process.cwd(), match);
        if (fs.existsSync(abs)) {
          return new StreamableFile(fs.createReadStream(abs));
        }
      }
    }

    const repos = [this.awardRepo, this.iprRepo, this.mergerRepo, this.collabRepo];
    for (const repo of repos) {
      const rec: any = await repo.findOne({ where: { filePath: searchPattern } as any });
      if (rec?.filePath) {
        const abs = path.isAbsolute(rec.filePath) ? rec.filePath : path.resolve(process.cwd(), rec.filePath);
        if (fs.existsSync(abs)) {
          return new StreamableFile(fs.createReadStream(abs));
        }
      }
    }

    throw new HttpException('File not found', HttpStatus.NOT_FOUND);
  }
}