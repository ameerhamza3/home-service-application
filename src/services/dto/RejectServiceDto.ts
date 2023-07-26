import { IsNotEmpty, IsString } from 'class-validator';

export class RejectServiceDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}
