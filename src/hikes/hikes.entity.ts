import { Booking } from 'src/bookings/bookings.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => User, guide => guide.hikes)
  guide: User;

  @OneToMany(() => Booking, booking => booking.hiker)
  bookings: Booking[];
}
