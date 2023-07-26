import { IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  notes: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  serviceId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  userId: number;
}
