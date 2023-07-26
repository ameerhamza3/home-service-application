import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReviewDto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Get('service/:id')
  getServiceReviews(@Param('id') serviceId: number) {
    return this.reviewService.getServiceReviews(serviceId);
  }
}
