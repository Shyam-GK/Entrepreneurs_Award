import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Get,
  Req,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Express } from 'express';
import { NomineeDetailsService } from './nominee-details.service';
import { UpdateNomineeDetailsDto } from './dto/update-nominee-details.dto';
import { CreateAwardDto } from './dto/create-award.dto';
import { CreateIprDto } from './dto/create-ipr.dto';
import { CreateMergerDto } from './dto/create-merger.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { Award } from './entities/award.entity';
import { Ipr } from './entities/ipr.entity';
import { Merger } from './entities/merger.entity';
import { Collaboration } from './entities/collaboration.entity';

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** sanitize + prefix */
function makePrefixedName(id: string, original: string) {
  const ext = path.extname(original || '');
  const base = path.basename(original || '', ext).replace(/[^a-zA-Z0-9\-_.]/g, '_');
  return `${id}_${base}${ext}`;
}

function storageFor(folderName: string) {
  return diskStorage({
    destination: (req, file, cb) => {
      const { userId } = req.params as { userId: string };
      const dest = path.join(process.cwd(), 'Uploads', folderName, userId);
      try {
        ensureDirSync(dest);
        cb(null, dest);
      } catch (e) {
        cb(e as any, dest);
      }
    },
    filename: (req, file, cb) => {
      const { userId } = req.params as { userId: string };
      const original = (file && (file as any).originalname) || 'file';
      cb(null, makePrefixedName(userId, original));
    },
  });
}

@Controller('nominee-details')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('user')
export class NomineeDetailsController {
  constructor(private readonly nomineeDetailsService: NomineeDetailsService) {}

  /** Returns or creates the caller's nominee row */
  @Get('my/profile')
  async getMyNomineeProfile(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    return this.nomineeDetailsService.findOrCreateNomineeDetailsForUser(userId);
  }

  /** Status used by frontend to disable "Apply" if profile exists */
  @Get('my/status')
  async getMyStatus(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    return this.nomineeDetailsService.getMyStatus(userId);
  }

  /** Upsert nominee profile (pure JSON, no files) */
  @Post(':userId/profile')
  async upsertProfileForUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateNomineeDetailsDto,
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) {
      return { message: 'Not authorized for this user' };
    }
    return this.nomineeDetailsService.updateMyNomineeDetails(userId, dto);
  }

  /** Upload single file for nominee_details fields: type = 'photo' | 'registration' */
  @Post(':userId/upload/:type')
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: storageForDynamic(),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async uploadFileForUser(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) return { message: 'Not authorized for this user' };
    if (!files || files.length === 0) throw new BadRequestException('No file uploaded');
    const t = (type || '').toLowerCase();
    if (t !== 'photo' && t !== 'registration') {
      throw new BadRequestException('Invalid upload type (photo or registration expected)');
    }
    return this.nomineeDetailsService.uploadFileForUser(userId, t as 'photo' | 'registration', files[0]);
  }

  /** Add multiple awards */
  @Post(':userId/awards')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('awards'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addAwardsForUser(
    @Param('userId') userId: string,
    @Body() dtos: CreateAwardDto | CreateAwardDto[],
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) return { message: 'Not authorized for this user' };
    const awardsArray = Array.isArray(dtos) ? dtos : [dtos];
    if (!files || files.length === 0) throw new BadRequestException('At least one file required for awards');
    if (files.length !== awardsArray.length) {
      throw new BadRequestException('Number of files must match number of awards');
    }
    const results: Award[] = [];
    for (let i = 0; i < awardsArray.length; i++) {
      const result = await this.nomineeDetailsService.addAwardForUser(userId, awardsArray[i], files[i]);
      results.push(result);
    }
    return results;
  }

  /** Add multiple IPRs */
  @Post(':userId/iprs')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('iprs'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addIprsForUser(
    @Param('userId') userId: string,
    @Body() dtos: CreateIprDto | CreateIprDto[],
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) return { message: 'Not authorized for this user' };
    const iprsArray = Array.isArray(dtos) ? dtos : [dtos];
    if (!files || files.length === 0) throw new BadRequestException('At least one file required for IPRs');
    if (files.length !== iprsArray.length) {
      throw new BadRequestException('Number of files must match number of IPRs');
    }
    const results: Ipr[] = [];
    for (let i = 0; i < iprsArray.length; i++) {
      const result = await this.nomineeDetailsService.addIprForUser(userId, iprsArray[i], files[i]);
      results.push(result);
    }
    return results;
  }

  /** Add multiple mergers */
  @Post(':userId/mergers')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('mergers'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addMergersForUser(
    @Param('userId') userId: string,
    @Body() dtos: CreateMergerDto | CreateMergerDto[],
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) return { message: 'Not authorized for this user' };
    const mergersArray = Array.isArray(dtos) ? dtos : [dtos];
    if (!files || files.length === 0) throw new BadRequestException('At least one file required for mergers');
    if (files.length !== mergersArray.length) {
      throw new BadRequestException('Number of files must match number of mergers');
    }
    const results: Merger[] = [];
    for (let i = 0; i < mergersArray.length; i++) {
      const result = await this.nomineeDetailsService.addMergerForUser(userId, mergersArray[i], files[i]);
      results.push(result);
    }
    return results;
  }

  /** Add multiple collaborations */
  @Post(':userId/collaborations')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('collaborations'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addCollaborationsForUser(
    @Param('userId') userId: string,
    @Body() dtos: CreateCollaborationDto | CreateCollaborationDto[],
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) return { message: 'Not authorized for this user' };
    const collabsArray = Array.isArray(dtos) ? dtos : [dtos];
    if (!files || files.length === 0) throw new BadRequestException('At least one file required for collaborations');
    if (files.length !== collabsArray.length) {
      throw new BadRequestException('Number of files must match number of collaborations');
    }
    const results: Collaboration[] = [];
    for (let i = 0; i < collabsArray.length; i++) {
      const result = await this.nomineeDetailsService.addCollaborationForUser(userId, collabsArray[i], files[i]);
      results.push(result);
    }
    return results;
  }

  /** File fetch passthrough */
  @Get('uploads/:fileId')
  async getFile(@Param('fileId') fileId: string) {
    return this.nomineeDetailsService.getFile(fileId);
  }
}

/** storage for /upload/:type where type is 'photo' or 'registration' */
function storageForDynamic() {
  return diskStorage({
    destination: (req, file, cb) => {
      const { userId, type } = req.params as { userId: string; type: string };
      const t = (type || '').toLowerCase();
      const folder = t === 'photo' || t === 'registration' ? t : 'misc';
      const dest = path.join(process.cwd(), 'Uploads', folder, userId);
      try {
        ensureDirSync(dest);
        cb(null, dest);
      } catch (e) {
        cb(e as any, dest);
      }
    },
    filename: (req, file, cb) => {
      const { userId } = req.params as { userId: string; type: string };
      const original = (file && (file as any).originalname) || 'file';
      cb(null, makePrefixedName(userId, original));
    },
  });
}