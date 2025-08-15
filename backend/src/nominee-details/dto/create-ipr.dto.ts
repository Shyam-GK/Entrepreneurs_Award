// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\dto\create-ipr.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateIprDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;
}