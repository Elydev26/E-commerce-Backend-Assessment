import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Updated user email address',
    example: 'newuser@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Updated user password',
    example: 'NewPassword123!',
  })
  @IsOptional()
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password?: string;
}

export class UserDto {
  @ApiProperty({ description: 'Unique user ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email: string;
}
