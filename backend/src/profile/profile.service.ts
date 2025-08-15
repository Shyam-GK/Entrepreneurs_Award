import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NomineeDetails } from '../nominee-details/entities/nominee-details.entity';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(NomineeDetails) private nomineeRepo: Repository<NomineeDetails>,
  ) {}

  async getProfile(id: string) {
    const nominee = await this.nomineeRepo.findOne({
      where: { user: { id } },
      relations: ['user', 'awards', 'iprs', 'mergers', 'collaborations'],
    });
    if (!nominee) throw new NotFoundException('Profile not found');
    return nominee;
  }

  async generateProfilePDF(id: string): Promise<Buffer> {
    const nominee = await this.getProfile(id);
    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: `Nominee Profile: ${nominee.user.name}`, style: 'header' },
        { text: `Email: ${nominee.user.email}`, style: 'subheader' },
        { text: `Company Name: ${nominee.companyName}`, style: 'subheader' },
        { text: `Company URL: ${nominee.companyWebsite}`, style: 'subheader' },
        // Add all fields
        { text: 'Details', style: 'sectionHeader' },
        { text: `Passout Year: ${nominee.passoutYear}` },
        // ... Add all other fields from nominee
        { text: 'Awards', style: 'sectionHeader' },
        nominee.awards.map(award => ({
          text: `Name: ${award.name}\nAwarded By: ${award.awardedBy}\nLevel: ${award.level}\nCategory: ${award.category}\nYear: ${award.yearReceived}\nDescription: ${award.description}\nFile: ${award.filePath || 'N/A'}`,
          style: 'item'
        })),
        { text: 'IPRs', style: 'sectionHeader' },
        nominee.iprs.map(ipr => ({
          text: `Type: ${ipr.type}\nTitle: ${ipr.title}\nRegistration Number: ${ipr.registrationNumber}\nFile: ${ipr.filePath || 'N/A'}`,
          style: 'item'
        })),
        { text: 'Mergers', style: 'sectionHeader' },
        nominee.mergers.map(merger => ({
          text: `Company: ${merger.mergerCompany}\nType: ${merger.mergerType}\nYear: ${merger.mergerYear}\nDescription: ${merger.mergerDescription}\nFile: ${merger.filePath || 'N/A'}`,
          style: 'item'
        })),
        { text: 'Collaborations', style: 'sectionHeader' },
        nominee.collaborations.map(collab => ({
          text: `Institution: ${collab.institutionName}\nType: ${collab.type}\nDuration: ${collab.duration}\nOutcomes: ${collab.outcomes}\nFile: ${collab.filePath || 'N/A'}`,
          style: 'item'
        })),
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        sectionHeader: { fontSize: 12, bold: true, margin: [0, 15, 0, 5] },
        item: { margin: [0, 5, 0, 5] },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => {});
    pdfDoc.end();

    return new Promise((resolve) => {
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}