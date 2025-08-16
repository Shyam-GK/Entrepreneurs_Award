import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { MergerType } from '../../enums/enums';

export { MergerType }; // Re-export MergerType

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
