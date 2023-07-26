import { Service } from 'src/services/entity/service.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
