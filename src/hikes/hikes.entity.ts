import { Booking } from 'src/bookings/bookings.entity';
import { Region } from 'src/region/region.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Hike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({default: "Easy"})
  difficulty: string;

  @Column()
  distance: number;

  @Column()
  elevationGain: number;

  @Column()
  date: Date;

  @Column({default: false})
  isDue: boolean;

  @Column()
  travelCost: number;

  @ManyToOne(() => Region, region => region.hikes)
  region: Region;

  @ManyToOne(() => User, guide => guide.hikes)
  guide: User;

  @OneToMany(() => Booking, booking => booking.hiker)
  bookings: Booking[];
}
