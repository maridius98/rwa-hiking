import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Hike } from 'src/hikes/hikes.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  isDue: boolean;

  @Column()
  isPaid: boolean;
  
  @ManyToOne(() => User, user => user.bookings)
  hiker: User;

  @ManyToOne(() => Hike, hike => hike.bookings)
  hike: Hike;
}