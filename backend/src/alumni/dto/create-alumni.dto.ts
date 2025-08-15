import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAlumniDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  photoId: string;

  @IsNumber()
  passoutYear: number;
}