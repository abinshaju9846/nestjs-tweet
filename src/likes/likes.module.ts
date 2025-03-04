import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { UsersModule } from 'src/users/users.module';
import { TweetsModule } from 'src/tweets/tweets.module';


@Module({
  imports:[TypeOrmModule.forFeature([Like]),UsersModule,TweetsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
