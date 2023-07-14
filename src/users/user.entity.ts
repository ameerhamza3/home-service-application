import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'admin' }) // Set 'admin' as the default role
  role: string;
}
