import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
