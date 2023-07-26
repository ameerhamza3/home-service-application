import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/entity/user.entity';
import { Category } from './category/entity/category.entity';
import { Service } from './services/entity/service.entity';
import { Review } from './review/entity/review.entity';
import { Booking } from './booking/booking.entity';

import { UserModule } from './users/user.module';
import { CategoryModule } from './category/category.module';
import { ServicesModule } from './services/service.module';
import { BookingModule } from './booking/booking.module';

import { ReviewModule } from './review/review.module';
import { PaymentsModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Register the ConfigModule here
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Category, Service, Booking, Review],
      synchronize: true,
    }),
    UserModule,
    CategoryModule,
    ServicesModule,
    BookingModule,
    ReviewModule,
    PaymentsModule,
  ],
})
export class AppModule {}
