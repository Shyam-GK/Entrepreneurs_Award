import { IsString, IsNumber, IsBoolean, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IprDetailDto {
  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  documentId: string;
}

class MergerDetailDto {
  @IsString()
  corporateName: string;

  @IsString()
  transactionType: string;

  @IsNumber()
  year: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  documentId: string;
}

class AwardDto {
  @IsString()
  name: string;

  @IsString()
  awardedBy: string;

  @IsString()
  level: string;

  @IsString()
  category: string;

  @IsNumber()
  year: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  documentId: string;
}

class AcademicCollaborationDto {
  @IsString()
  institutionName: string;

  @IsString()
  collaborationType: string;

  @IsString()
  duration: string;

  @IsString()
  outcomes: string;

  @IsString()
  @IsOptional()
  documentId: string;
}

export class UpdateAlumniProfileDto {
  @IsString()
  companyName: string;

  @IsNumber()
  establishmentYear: number;

  @IsNumber()
  employeeCount: number;

  @IsNumber()
  turnover: number;

  @IsBoolean()
  isFounder: boolean;

  @IsBoolean()
  isFirstGeneration: boolean;

  @IsBoolean()
  @IsOptional()
  isUnrelatedToFamilyBusiness: boolean;

  @IsString()
  entityType: string;

  @IsString()
  registrationNumber: string;

  @IsDate()
  @Type(() => Date)
  registrationDate: Date;

  @IsString()
  registeredAddress: string;

  @IsString()
  registrationPlace: string;

  @IsString()
  @IsOptional()
  registrationCertificateId: string;

  @IsString()
  businessDomain: string;

  @IsString()
  innovations: string;

  @IsBoolean()
  hasIpr: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IprDetailDto)
  @IsOptional()
  iprDetails: IprDetailDto[];

  @IsBoolean()
  hasMergers: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MergerDetailDto)
  @IsOptional()
  mergerDetails: MergerDetailDto[];

  @IsBoolean()
  hasForeignCollaborations: boolean;

  @IsString()
  @IsOptional()
  foreignCollaborationDetails: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardDto)
  awards: AwardDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicCollaborationDto)
  academicCollaborations: AcademicCollaborationDto[];

  @IsBoolean()
  hasSustainabilityPractices: boolean;

  @IsString()
  @IsOptional()
  sustainabilityDetails: string;

  @IsString()
  ethicalPractices: string;
}