import { IsOptional, IsString, IsInt, IsNumber, IsBoolean, IsEnum, Matches } from 'class-validator';
import { FounderType } from '../../enums/enums';

export class UpdateNomineeDetailsDto {
  @IsOptional()
  @IsInt()
  passoutYear?: number;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyType?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'registrationDate must be in YYYY-MM-DD format' })
  registrationDate?: string;

  @IsOptional()
  @IsString()
  registeredAddress?: string;

  @IsOptional()
  @IsString()
  registrationPlace?: string;

  @IsOptional()
  @IsEnum(FounderType)
  founderType?: FounderType;

  @IsOptional()
  @IsString()
  companyDescription?: string;

  @IsOptional()
  @IsInt()
  yearOfEstablishment?: number;

  @IsOptional()
  @IsInt()
  totalEmployees?: number;

  @IsOptional()
  @IsNumber()
  annualTurnover?: number;

  @IsOptional()
  @IsString()
  businessDomain?: string;

  @IsOptional()
  @IsString()
  keyInnovations?: string;

  @IsOptional()
  @IsBoolean()
  isFirstGeneration?: boolean;

  @IsOptional()
  @IsBoolean()
  isUnrelatedToFamily?: boolean;

  @IsOptional()
  @IsBoolean()
  hasIprs?: boolean;

  @IsOptional()
  @IsBoolean()
  hasMergers?: boolean;

  @IsOptional()
  @IsBoolean()
  hasCollaborations?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAwards?: boolean;

  @IsOptional()
  @IsBoolean()
  hasForeignPresence?: boolean;

  @IsOptional()
  @IsBoolean()
  hasSustainability?: boolean;

  @IsOptional()
  @IsString()
  iprDescription?: string;

  @IsOptional()
  @IsString()
  foreignDescription?: string;

  @IsOptional()
  @IsString()
  sustainabilityDescription?: string;

  @IsOptional()
  @IsString()
  ethicsDescription?: string;
}