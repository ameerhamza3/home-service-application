import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/createBooking.dto';
import { UserService } from '../users/user.service';
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UserService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      return this.bookingRepository.save(createBookingDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookingById(id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });

      if (!booking) {
        throw new HttpException(
          `Booking with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return booking;
    } catch (error) {
      throw new HttpException(
        `Booking with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    try {
      const bookings = await this.bookingRepository.find({
        where: { userId },
        relations: ['service'],
      });

      if (!bookings || bookings.length === 0) {
        throw new HttpException(
          `No bookings found for user with ID ${userId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return bookings;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch user bookings`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
