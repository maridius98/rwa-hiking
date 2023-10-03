import { Hike } from "src/hikes/hikes.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    //Nomenclature of Territorial Units for Statistics
    @Column()
    NUTS: string;

    @Column("simple-array")
    areas: string[];

    @OneToMany(() => Hike, hike => hike.region)
    hikes: Hike[];

    @ManyToMany(() => User, guide => guide.regions)
    guides: User[];
}