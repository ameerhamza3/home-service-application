import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../category/entity/category.entity';
import { Booking } from 'src/booking/booking.entity';
import { Review } from '../../review/entity/review.entity';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  location: string;

  @Column()
  price: number;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @CreateDateColumn()
  createdAt?: Date;

  updatedAt: Date;

  @Column({ default: 'pending' })
  isApproved: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @Column({ name: 'categoryId' })
  categoryId: number;

  @Column({ name: 'userId' })
  userId: number;
}
