// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\dto\create-merger.dto.ts
import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { MergerType } from '../../enums/enums';

export class CreateMergerDto {
  @IsString()
  @IsOptional()
  mergerCompany?: string;

  @IsEnum(MergerType)
  @IsOptional()
  mergerType?: MergerType;

  @IsInt()
  @IsOptional()
  mergerYear?: number;

  @IsString()
  @IsOptional()
  mergerDescription?: string;
}