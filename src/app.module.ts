import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  }),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
