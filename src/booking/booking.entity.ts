import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Service } from '../services/entity/service.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  bookingDate?: Date;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  @JoinColumn({ name: 'customerId' })
  user: User;

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ name: 'serviceId' })
  serviceId: number;

  @Column({ name: 'customerId' })
  userId: number;
}
