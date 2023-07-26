import {
  IsNumber,
  IsString,
  Min,
  Max,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  serviceId: number;
}
