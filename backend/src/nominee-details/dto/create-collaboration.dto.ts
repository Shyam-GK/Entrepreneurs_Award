// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\dto\create-collaboration.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateCollaborationDto {
  @IsString()
  @IsOptional()
  institutionName?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  outcomes?: string;
}