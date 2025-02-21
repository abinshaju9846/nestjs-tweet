import { Profile } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({unique: true})
    username: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @CreateDateColumn({type:'timestamp'})
    createdAt: Date;

    @OneToOne(()=>Profile,(profile)=>profile.user)
    profile:Profile;

}
