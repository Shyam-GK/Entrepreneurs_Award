// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\dto\update-nominee-details.dto.ts
import { IsInt, IsString, IsDate, IsNumber, IsBoolean, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { FounderType } from '../../enums/enums';

export class UpdateNomineeDetailsDto {
  @IsInt()
  @IsOptional()
  passoutYear?: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyType?: string;

  @IsUrl()
  @IsOptional()
  companyWebsite?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsDate()
  @IsOptional()
  registrationDate?: Date;

  @IsString()
  @IsOptional()
  registeredAddress?: string;

  @IsString()
  @IsOptional()
  registrationPlace?: string;

  @IsString()
  @IsOptional()
  registrationCertificate?: string;

  @IsEnum(FounderType)
  @IsOptional()
  founderType?: FounderType;

  @IsString()
  @IsOptional()
  companyDescription?: string;

  @IsInt()
  @IsOptional()
  yearOfEstablishment?: number;

  @IsInt()
  @IsOptional()
  totalEmployees?: number;

  @IsNumber()
  @IsOptional()
  annualTurnover?: number;

  @IsString()
  @IsOptional()
  businessDomain?: string;

  @IsString()
  @IsOptional()
  keyInnovations?: string;

  @IsBoolean()
  @IsOptional()
  isFirstGeneration?: boolean;

  @IsBoolean()
  @IsOptional()
  isUnrelatedToFamily?: boolean;

  @IsBoolean()
  @IsOptional()
  hasIprs?: boolean;

  @IsBoolean()
  @IsOptional()
  hasMergers?: boolean;

  @IsBoolean()
  @IsOptional()
  hasCollaborations?: boolean;

  @IsBoolean()
  @IsOptional()
  hasAwards?: boolean;

  @IsBoolean()
  @IsOptional()
  hasForeignPresence?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSustainability?: boolean;

  @IsString()
  @IsOptional()
  iprDescription?: string;

  @IsString()
  @IsOptional()
  foreignDescription?: string;

  @IsString()
  @IsOptional()
  sustainabilityDescription?: string;

  @IsString()
  @IsOptional()
  ethicsDescription?: string;
}