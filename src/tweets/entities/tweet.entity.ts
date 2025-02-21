import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tweets')
export class Tweet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text'})
    content: string;

    @Column()
    user_id: number;

    @CreateDateColumn({type:'timestamp'})
    created_at: Date;

    @ManyToOne(()=>User,(user)=>user.tweets,{onDelete:'CASCADE',eager:true})
    @JoinColumn({name:'user_id'})
   user: User
}
