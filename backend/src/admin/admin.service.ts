import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NomineeDetails } from '../nominee-details/entities/nominee-details.entity';
import { Award } from '../nominee-details/entities/award.entity';
import { Ipr } from '../nominee-details/entities/ipr.entity';
import { Merger } from '../nominee-details/entities/merger.entity';
import { Collaboration } from '../nominee-details/entities/collaboration.entity';
import { Nomination } from '../nominations/entities/nomination.entity';
import { User } from '../users/entities/user.entity';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const API = process.env.API_URL || 'http://localhost:3000';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(NomineeDetails) private nomineeRepo: Repository<NomineeDetails>,
    @InjectRepository(Award) private awardRepo: Repository<Award>,
    @InjectRepository(Ipr) private iprRepo: Repository<Ipr>,
    @InjectRepository(Merger) private mergerRepo: Repository<Merger>,
    @InjectRepository(Collaboration) private collabRepo: Repository<Collaboration>,
    @InjectRepository(Nomination) private nominationRepo: Repository<Nomination>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getNomineeDetailsList(email: string) {
    const query = this.nomineeRepo.createQueryBuilder('nominee')
      .leftJoinAndSelect('nominee.user', 'user')
      .select(['nominee.id', 'nominee.companyName', 'nominee.photo', 'user.name', 'user.email', 'user.mobile']);

    if (email) {
      query.where('user.email LIKE :email', { email: `%${email}%` });
    }

    const nominees = await query.getMany();
    console.log('Fetched nominees:', nominees);
    return nominees;
  }

  async getNomineeDetail(id: string) {
    console.log('Fetching nominee with ID:', id);
    const nominee = await this.nomineeRepo.createQueryBuilder('nominee')
      .leftJoinAndSelect('nominee.user', 'user')
      .leftJoinAndSelect('nominee.awards', 'awards')
      .leftJoinAndSelect('nominee.iprs', 'iprs')
      .leftJoinAndSelect('nominee.mergers', 'mergers')
      .leftJoinAndSelect('nominee.collaborations', 'collaborations')
      .where('nominee.id = :id', { id })
      .select([
        'nominee.id',
        'nominee.photo',
        'nominee.registrationCertificate',
        'nominee.companyName',
        'nominee.companyType',
        'nominee.companyWebsite',
        'nominee.registrationNumber',
        'nominee.registrationDate',
        'nominee.registeredAddress',
        'nominee.founderType',
        'nominee.yearOfEstablishment',
        'nominee.totalEmployees',
        'nominee.annualTurnover',
        'nominee.businessDomain',
        'nominee.keyInnovations',
        'nominee.isFirstGeneration',
        'nominee.isUnrelatedToFamily',
        'user.name',
        'user.email',
        'user.mobile',
        'awards.id',
        'awards.name',
        'awards.awardedBy',
        'awards.level',
        'awards.category',
        'awards.yearReceived',
        'awards.description',
        'awards.filePath',
        'iprs.id',
        'iprs.type',
        'iprs.title',
        'iprs.registrationNumber',
        'iprs.filePath',
        'mergers.id',
        'mergers.mergerCompany',
        'mergers.mergerType',
        'mergers.mergerYear',
        'mergers.mergerDescription',
        'mergers.filePath',
        'collaborations.id',
        'collaborations.institutionName',
        'collaborations.type',
        'collaborations.duration',
        'collaborations.outcomes',
        'collaborations.filePath',
      ])
      .getOne();

    console.log('Nominee query result:', nominee);
    if (!nominee) {
      throw new NotFoundException(`Nominee with ID ${id} not found.`);
    }
    return nominee;
  }

  async getNominators(id: string) {
    const nominators = await this.nominationRepo.createQueryBuilder('nomination')
      .leftJoinAndSelect('nomination.nominator', 'nominator')
      .where('nomination.nomineeUserId = :id', { id })
      .select(['nomination.id', 'nomination.nominatedAt', 'nominator.name', 'nominator.email'])
      .getMany();
    console.log('Fetched nominators for ID:', id, nominators);
    return nominators;
  }

  async generateApplicationPDF(id: string): Promise<Buffer> {
    try {
      const nominee = await this.getNomineeDetail(id);
      console.log('Nominee Data for PDF:', nominee);
      if (!nominee.user) {
        throw new InternalServerErrorException('User details not found for this nominee.');
      }

      const fontPath = path.join(__dirname, '..', 'fonts');
      if (!fs.existsSync(fontPath)) {
        fs.mkdirSync(fontPath, { recursive: true });
      }

      const fonts = {
        Roboto: {
          normal: path.join(fontPath, 'Roboto-Regular.ttf'),
          bold: path.join(fontPath, 'Roboto-Medium.ttf'),
          italics: path.join(fontPath, 'Roboto-Italic.ttf'),
          bolditalics: path.join(fontPath, 'Roboto-MediumItalic.ttf'),
        },
      };

      const downloadFont = (url: string, filePath: string) => {
        if (!fs.existsSync(filePath)) {
          console.log(`Downloading font to ${filePath}...`);
          return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filePath);
            https.get(url, (res) => {
              res.pipe(file);
              file.on('finish', () => {
                file.close();
                resolve(true);
              });
            }).on('error', (err) => {
              fs.unlink(filePath, () => {});
              reject(err);
            });
          });
        }
        return Promise.resolve(true);
      };

      await Promise.all([
        downloadFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fonts.Roboto.normal),
        downloadFont('https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fonts.Roboto.bold),
        downloadFont('https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzc.ttf', fonts.Roboto.italics),
        downloadFont('https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1MmSU5fBBc9.ttf', fonts.Roboto.bolditalics),
      ]).catch((err) => {
        console.error('Font download failed:', err);
        throw new InternalServerErrorException('Failed to download required fonts.');
      });

      const printer = new PdfPrinter(fonts);

      const docDefinition: TDocumentDefinitions = {
        content: [
          { text: `Application for ${nominee.user.name || 'Unknown'}`, style: 'header' },
          { text: `Email: ${nominee.user.email || 'N/A'}`, style: 'subheader' },
          { text: `Mobile: ${nominee.user.mobile || 'N/A'}`, style: 'subheader' },
          { text: 'Nominee Details', style: 'sectionHeader' },
          {
            text: [
              `Company Name: ${nominee.companyName || 'N/A'}\n`,
              `Photo: ${nominee.photo ? `${API}/uploads/${nominee.photo.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
              `Registration Certificate: ${nominee.registrationCertificate ? `${API}/uploads/${nominee.registrationCertificate.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
              `Company Type: ${nominee.companyType || 'N/A'}\n`,
              `Company Website: ${nominee.companyWebsite || 'N/A'}\n`,
              `Registration Number: ${nominee.registrationNumber || 'N/A'}\n`,
              `Registration Date: ${nominee.registrationDate ? new Date(nominee.registrationDate).toLocaleDateString() : 'N/A'}\n`,
              `Registered Address: ${nominee.registeredAddress || 'N/A'}\n`,
              `Founder Type: ${nominee.founderType || 'N/A'}\n`,
              `Year Established: ${nominee.yearOfEstablishment || 'N/A'}\n`,
              `Total Employees: ${nominee.totalEmployees || 'N/A'}\n`,
              `Annual Turnover: ${nominee.annualTurnover ? `$${nominee.annualTurnover.toLocaleString()}` : 'N/A'}\n`,
              `Business Domain: ${nominee.businessDomain || 'N/A'}\n`,
              `Key Innovations: ${nominee.keyInnovations || 'N/A'}\n`,
            ],
          },
          { text: 'Mergers', style: 'sectionHeader' },
          ...nominee.mergers.map((merger) => ({
            text: [
              `Company: ${merger.mergerCompany || 'N/A'}\n`,
              `Type: ${merger.mergerType || 'N/A'}\n`,
              `Year: ${merger.mergerYear || 'N/A'}\n`,
              `Description: ${merger.mergerDescription || 'N/A'}\n`,
              `Certificate: ${merger.filePath ? `${API}/uploads/${merger.filePath.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
            ],
          })),
          { text: 'Awards', style: 'sectionHeader' },
          ...nominee.awards.map((award) => ({
            text: [
              `Name: ${award.name || 'N/A'}\n`,
              `Awarded By: ${award.awardedBy || 'N/A'}\n`,
              `Level: ${award.level || 'N/A'}\n`,
              `Category: ${award.category || 'N/A'}\n`,
              `Year: ${award.yearReceived || 'N/A'}\n`,
              `Description: ${award.description || 'N/A'}\n`,
              `Certificate: ${award.filePath ? `${API}/uploads/${award.filePath.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
            ],
          })),
          { text: 'IPRs', style: 'sectionHeader' },
          ...nominee.iprs.map((ipr) => ({
            text: [
              `Type: ${ipr.type || 'N/A'}\n`,
              `Title: ${ipr.title || 'N/A'}\n`,
              `Registration Number: ${ipr.registrationNumber || 'N/A'}\n`,
              `Certificate: ${ipr.filePath ? `${API}/uploads/${ipr.filePath.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
            ],
          })),
          { text: 'Collaborations', style: 'sectionHeader' },
          ...nominee.collaborations.map((collab) => ({
            text: [
              `Institution Name: ${collab.institutionName || 'N/A'}\n`,
              `Type: ${collab.type || 'N/A'}\n`,
              `Duration: ${collab.duration || 'N/A'}\n`,
              `Outcomes: ${collab.outcomes || 'N/A'}\n`,
              `Certificate: ${collab.filePath ? `${API}/uploads/${collab.filePath.replace(/^(Uploads|uploads)\//, '')}` : 'N/A'}\n`,
            ],
          })),
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 5] },
          sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk as Buffer));
      pdfDoc.on('end', () => {});
      pdfDoc.end();

      return new Promise((resolve) => {
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Failed to generate PDF. Check server logs for details.');
    }
  }
}
