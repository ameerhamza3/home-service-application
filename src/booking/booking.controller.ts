import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/createBooking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id);
  }

  @Get('user/:id')
  async getUserBookings(@Param('id') userId: number) {
    return this.bookingService.getUserBookings(userId);
  }
}
