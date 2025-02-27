import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id:number
    @Column({unique: true})
    role:string

    @OneToMany(()=>User,(user)=>user.role)
    user:User[]


}
