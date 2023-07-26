import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { UserService } from '../users/user.service'; // Update the path to the UserService

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingService, UserService], // Include the UserService as a provider
  controllers: [BookingController],
})
export class BookingModule {}
