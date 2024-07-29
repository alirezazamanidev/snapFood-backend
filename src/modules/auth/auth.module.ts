import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({global:true}),TypeOrmModule.forFeature([UserEntity,OtpEntity])],
  controllers: [AuthController],
  providers: [AuthService,TokenService],
})
export class AuthModule {}
