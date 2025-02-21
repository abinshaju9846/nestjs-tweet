import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    user_id:number;
    @Column({type:'text',nullable:true})
    bio:string;
    @Column({nullable:true})
    avatar:string;
    @CreateDateColumn({type:'timestamp'})
    created_at: Date;

    @OneToOne(()=>User,(user)=>user.profile,{onDelete:'CASCADE',eager:true})
    @JoinColumn({name:'user_id'})
    user:User
}
