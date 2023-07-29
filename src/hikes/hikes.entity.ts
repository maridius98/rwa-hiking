import { Booking } from 'src/bookings/bookings.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Hike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  difficulty: string;

  @Column()
  distance: number;

  @Column()
  elevationGain: number;

  @Column()
  date: Date;

  @Column()
  isDue: boolean;

  @OneToMany(() => Booking, booking => booking.hiker)
  bookings: Booking[];
}
