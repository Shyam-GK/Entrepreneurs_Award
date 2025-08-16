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
import { CreateMergerDto, MergerType } from './dto/create-merger.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { Award } from './entities/award.entity';
import { Ipr } from './entities/ipr.entity';
import { Merger } from './entities/merger.entity';
import { Collaboration } from './entities/collaboration.entity';

// Define valid types to match database enums
const VALID_AWARD_LEVELS = ['National', 'International', 'Industry'];
const VALID_IPR_TYPES = ['Patent', 'Trademark', 'Copyright'];
const VALID_COLLABORATION_TYPES = ['Academic', 'Industry', 'Government'];

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

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

  @Get('my/profile')
  async getMyNomineeProfile(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    console.log(`Fetching profile for userId: ${userId}`);
    return this.nomineeDetailsService.findOrCreateNomineeDetailsForUser(userId);
  }

  @Get('my/status')
  async getMyStatus(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    console.log(`Fetching status for userId: ${userId}`);
    return this.nomineeDetailsService.getMyStatus(userId);
  }

  @Post(':userId/profile')
  async upsertProfileForUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateNomineeDetailsDto,
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) {
      throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    }
    console.log(`Upserting profile for userId: ${userId}`, JSON.stringify(dto, null, 2));
    return this.nomineeDetailsService.updateMyNomineeDetails(userId, dto);
  }

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
    if (req.user?.id !== userId) throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    if (!files || files.length === 0) throw new BadRequestException('No file uploaded');
    const t = (type || '').toLowerCase();
    if (t !== 'photo' && t !== 'registration') {
      throw new BadRequestException('Invalid upload type (photo or registration expected)');
    }
    console.log(`Uploading file for userId: ${userId}, type: ${t}, file: ${files[0]?.originalname}`);
    return this.nomineeDetailsService.uploadFileForUser(userId, t as 'photo' | 'registration', files[0]);
  }

  @Post(':userId/awards')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('awards'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addAwardsForUser(
    @Param('userId') userId: string,
    @Body('dtos') dtosBody: string | CreateAwardDto | CreateAwardDto[],
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    
    let awardsArray: CreateAwardDto[];
    if (typeof dtosBody === 'string') {
      try {
        awardsArray = JSON.parse(dtosBody);
      } catch (e) {
        throw new BadRequestException('Invalid DTO format: dtos must be valid JSON');
      }
    } else {
      awardsArray = Array.isArray(dtosBody) ? dtosBody : [dtosBody];
    }

    if (awardsArray.length === 0) {
      throw new BadRequestException('At least one award DTO is required');
    }

    // Validate level
    awardsArray.forEach((dto, index) => {
      if (dto.level && !VALID_AWARD_LEVELS.includes(dto.level)) {
        throw new BadRequestException(`Invalid level at index ${index}: ${dto.level}. Valid values are: ${VALID_AWARD_LEVELS.join(', ')}`);
      }
    });

    console.log(`Adding awards for userId: ${userId}, awards: ${JSON.stringify(awardsArray, null, 2)}, files: ${files.map(f => f?.originalname).join(', ')}`);
    const results: Award[] = [];
    for (let i = 0; i < awardsArray.length; i++) {
      const file = files[i] || null;
      try {
        const result = await this.nomineeDetailsService.addAwardForUser(userId, awardsArray[i], file);
        results.push(result);
      } catch (err) {
        console.error(`Failed to add award for userId: ${userId}, index: ${i}`, err);
        throw new HttpException(`Failed to add award at index ${i}: ${err.message}`, HttpStatus.BAD_REQUEST);
      }
    }
    return results;
  }

  @Post(':userId/iprs')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('iprs'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addIprsForUser(
    @Param('userId') userId: string,
    @Body('dtos') dtosBody: string | CreateIprDto | CreateIprDto[],
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    
    let iprsArray: CreateIprDto[];
    if (typeof dtosBody === 'string') {
      try {
        iprsArray = JSON.parse(dtosBody);
      } catch (e) {
        throw new BadRequestException('Invalid DTO format: dtos must be valid JSON');
      }
    } else {
      iprsArray = Array.isArray(dtosBody) ? dtosBody : [dtosBody];
    }

    if (iprsArray.length === 0) {
      throw new BadRequestException('At least one IPR DTO is required');
    }

    // Validate type
    iprsArray.forEach((dto, index) => {
      if (dto.type && !VALID_IPR_TYPES.includes(dto.type)) {
        throw new BadRequestException(`Invalid type at index ${index}: ${dto.type}. Valid values are: ${VALID_IPR_TYPES.join(', ')}`);
      }
    });

    console.log(`Adding IPRs for userId: ${userId}, IPRs: ${JSON.stringify(iprsArray, null, 2)}, files: ${files.map(f => f?.originalname).join(', ')}`);
    const results: Ipr[] = [];
    for (let i = 0; i < iprsArray.length; i++) {
      const file = files[i] || null;
      try {
        const result = await this.nomineeDetailsService.addIprForUser(userId, iprsArray[i], file);
        results.push(result);
      } catch (err) {
        console.error(`Failed to add IPR for userId: ${userId}, index: ${i}`, err);
        throw new HttpException(`Failed to add IPR at index ${i}: ${err.message}`, HttpStatus.BAD_REQUEST);
      }
    }
    return results;
  }

  @Post(':userId/mergers')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('mergers'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addMergersForUser(
    @Param('userId') userId: string,
    @Body('dtos') dtosBody: string | CreateMergerDto | CreateMergerDto[],
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    
    let mergersArray: CreateMergerDto[];
    if (typeof dtosBody === 'string') {
      try {
        mergersArray = JSON.parse(dtosBody);
      } catch (e) {
        throw new BadRequestException('Invalid DTO format: dtos must be valid JSON');
      }
    } else {
      mergersArray = Array.isArray(dtosBody) ? dtosBody : [dtosBody];
    }

    if (mergersArray.length === 0) {
      throw new BadRequestException('At least one merger DTO is required');
    }

    // Validate mergerType
    mergersArray.forEach((dto, index) => {
      if (dto.mergerType && !Object.values(MergerType).includes(dto.mergerType)) {
        throw new BadRequestException(`Invalid mergerType at index ${index}: ${dto.mergerType}. Valid values are: ${Object.values(MergerType).join(', ')}`);
      }
    });

    console.log(`Adding mergers for userId: ${userId}, mergers: ${JSON.stringify(mergersArray, null, 2)}, files: ${files.map(f => f?.originalname).join(', ')}`);
    const results: Merger[] = [];
    for (let i = 0; i < mergersArray.length; i++) {
      const file = files[i] || null;
      try {
        const result = await this.nomineeDetailsService.addMergerForUser(userId, mergersArray[i], file);
        results.push(result);
      } catch (err) {
        console.error(`Failed to add merger for userId: ${userId}, index: ${i}`, err);
        throw new HttpException(`Failed to add merger at index ${i}: ${err.message}`, HttpStatus.BAD_REQUEST);
      }
    }
    return results;
  }

  @Post(':userId/collaborations')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFor('collaborations'),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async addCollaborationsForUser(
    @Param('userId') userId: string,
    @Body('dtos') dtosBody: string | CreateCollaborationDto | CreateCollaborationDto[],
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: any,
  ) {
    if (req.user?.id !== userId) throw new HttpException('Not authorized for this user', HttpStatus.FORBIDDEN);
    
    let collabsArray: CreateCollaborationDto[];
    if (typeof dtosBody === 'string') {
      try {
        collabsArray = JSON.parse(dtosBody);
      } catch (e) {
        throw new BadRequestException('Invalid DTO format: dtos must be valid JSON');
      }
    } else {
      collabsArray = Array.isArray(dtosBody) ? dtosBody : [dtosBody];
    }

    if (collabsArray.length === 0) {
      throw new BadRequestException('At least one collaboration DTO is required');
    }

    // Validate type
    collabsArray.forEach((dto, index) => {
      if (dto.type && !VALID_COLLABORATION_TYPES.includes(dto.type)) {
        throw new BadRequestException(`Invalid type at index ${index}: ${dto.type}. Valid values are: ${VALID_COLLABORATION_TYPES.join(', ')}`);
      }
    });

    console.log(`Adding collaborations for userId: ${userId}, collaborations: ${JSON.stringify(collabsArray, null, 2)}, files: ${files.map(f => f?.originalname).join(', ')}`);
    const results: Collaboration[] = [];
    for (let i = 0; i < collabsArray.length; i++) {
      const file = files[i] || null;
      try {
        const result = await this.nomineeDetailsService.addCollaborationForUser(userId, collabsArray[i], file);
        results.push(result);
      } catch (err) {
        console.error(`Failed to add collaboration for userId: ${userId}, index: ${i}`, err);
        throw new HttpException(`Failed to add collaboration at index ${i}: ${err.message}`, HttpStatus.BAD_REQUEST);
      }
    }
    return results;
  }

  @Get('uploads/:fileId')
  async getFile(@Param('fileId') fileId: string) {
    console.log(`Fetching file: ${fileId}`);
    return this.nomineeDetailsService.getFile(fileId);
  }
}

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