import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Hike } from 'src/hikes/hikes.entity';

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

  @Column()
  isGuide: boolean;

  @OneToMany(() => Hike, hike => hike.guide)
  hikes: Hike[];

  @OneToMany(() => Booking, booking => booking.hiker)
  bookings: Booking[];
}