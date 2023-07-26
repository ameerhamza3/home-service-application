import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/createReviewDto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      return this.reviewRepository.save(createReviewDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      return this.reviewRepository.find();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServiceReviews(serviceId: number): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.find({
        relations: ['service'],
        where: {
          service: { id: serviceId },
        },
      });

      if (!reviews || reviews.length === 0) {
        throw new HttpException(
          'No reviews found for the service',
          HttpStatus.NOT_FOUND,
        );
      }

      return reviews;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch service reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
