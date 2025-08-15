// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\dto\create-award.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAwardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  awardedBy?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @IsOptional()
  yearReceived?: number;

  @IsString()
  @IsOptional()
  description?: string;
}