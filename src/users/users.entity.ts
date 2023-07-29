import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  gender: string;

  @OneToMany(() => Booking, booking => booking.hiker)
  bookings: Booking[];
}