import { IsEmail, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
