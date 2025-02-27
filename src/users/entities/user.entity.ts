import { Like } from "src/likes/entities/like.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Role } from "src/role/entities/role.entity";
import { Tweet } from "src/tweets/entities/tweet.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    @Column()
    role_id:number
    @CreateDateColumn({type:'timestamp'})
    createdAt: Date;

    @OneToOne(()=>Profile,(profile)=>profile.user)
    profile:Profile;

    @OneToMany(()=>Tweet,(tweet)=>tweet.user)
    tweets:Tweet[];

    @OneToMany(()=>Like,(like)=>like.user)
    likes:Like[];

    @ManyToOne(()=>Role,(role)=>role.id)
    @JoinColumn({name:'role_id',})
    role: Role[]

}
