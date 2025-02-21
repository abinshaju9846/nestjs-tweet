import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory:()=>{
      return{
        type:'postgres',
        host:'localhost',
        port:5432,
        username:'postgres',
        password:'1234',
        database:'tweet',
        autoLoadEntities:true,
        synchronize:true,
      }
    }
  }),UsersModule, ProfileModule, TweetsModule, LikesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
