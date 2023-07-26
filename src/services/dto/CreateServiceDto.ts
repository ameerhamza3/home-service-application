import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  userId: number;
}
