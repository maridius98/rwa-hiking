import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Hike } from 'src/hikes/hikes.entity';
import { Region } from 'src/region/region.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    fullName: string;

    @Column({select: false})
    password: string;

    @Column()
    email: string;

    @Column()
    gender: string;

    @Column()
    isGuide: boolean = false;

    @OneToMany(() => Hike, hike => hike.guide)
    hikes: Hike[];

    @ManyToMany(() => Region, region => region.guides)
    regions: Region[];

    @OneToMany(() => Booking, booking => booking.hiker)
    bookings: Booking[];
}