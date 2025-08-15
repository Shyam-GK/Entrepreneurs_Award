import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nomination } from './entities/nomination.entity';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { UsersService } from '../users/users.service';
import { NominationStatus } from '../enums/enums';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NominationsService {
  constructor(
    @InjectRepository(Nomination)
    private nominationsRepository: Repository<Nomination>,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  async create(nominatorId: string, dto: CreateNominationDto): Promise<Nomination> {
    const nominator = await this.usersService.findOne(nominatorId);

    // normalize email for comparisons
    const nomineeEmailNormalized = dto.nomineeEmail.toLowerCase();

    // If nomination already exists by same nominator + email, throw Conflict
    const existing = await this.nominationsRepository.findOne({
      where: {
        nominator: { id: nominatorId },
        nomineeEmail: nomineeEmailNormalized,
      },
    });
    if (existing) {
      throw new HttpException('You have already nominated this email', HttpStatus.CONFLICT);
    }

    // Find if nominee is already a registered user
    let nomineeUser: User | null = null;
    try {
      nomineeUser = await this.usersService.findByEmail(nomineeEmailNormalized);
    } catch (err) {
      nomineeUser = null;
    }

    const nomination = this.nominationsRepository.create({
      nominator,
      nomineeUser: nomineeUser ? nomineeUser : null,
      nomineeEmail: nomineeEmailNormalized,
      nomineeName: dto.nomineeName,
      nomineeMobile: dto.nomineeMobile ?? null,
      relationship: dto.relationship ?? null,
      status: nomineeUser ? NominationStatus.Submitted : NominationStatus.Pending,
    });

    const savedNomination = await this.nominationsRepository.save(nomination);

    // Only send email if nominee is not registered (avoid duplicate mail)
    if (!nomineeUser) {
      await this.mailerService.sendMail({
        to: dto.nomineeEmail,
        subject: 'You have been nominated for Entrepreneur Award',
        template: 'nomination',
        context: {
          nomineeName: dto.nomineeName,
          nominatorName: nominator.name,
          applyUrl: `${process.env.APP_URL}/auth/register?email=${encodeURIComponent(dto.nomineeEmail)}`,
        },
      });
    }

    return savedNomination;
  }


  async updateNominationStatus(email: string, userId: string): Promise<void> {
    const nomEmail = email.toLowerCase();
    const nominations = await this.nominationsRepository.find({
      where: { nomineeEmail: nomEmail },
      relations: ['nominator'],
    });

    if (!nominations || nominations.length === 0) return;

    for (const nom of nominations) {
      if (nom.status === NominationStatus.Pending) {
        nom.nomineeUser = { id: userId } as User; // attach by id
        nom.status = NominationStatus.Submitted;
        await this.nominationsRepository.save(nom);
      }
    }
  }


  async findByNominator(nominatorId: string): Promise<Nomination[]> {
    return this.nominationsRepository.find({
      where: { nominator: { id: nominatorId } },
      relations: ['nomineeUser', 'nominator'],
    });
  }
}
