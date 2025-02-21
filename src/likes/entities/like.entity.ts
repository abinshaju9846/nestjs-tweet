import { Tweet } from "src/tweets/entities/tweet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tweet_id: number;

    @Column()
    user_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'user_id', })
    user: User;

    @ManyToOne(() => Tweet, (tweet) => tweet.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'tweet_id', })
    tweet: Tweet;



}
