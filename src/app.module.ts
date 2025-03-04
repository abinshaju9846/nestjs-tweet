import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/config.database';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    // load:[configDatabase]
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (ConfigService) => typeOrmConfig(ConfigService)
  }), UsersModule, ProfileModule, TweetsModule, LikesModule, RoleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
