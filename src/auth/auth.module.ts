import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
 imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d'
      },
    }),
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
