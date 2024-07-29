import {
  HttpStatus,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { AuthMessage, PublicMessage } from 'src/common/enums/messages.enum';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { CookieNames } from 'src/common/enums/cookieNames.enum';
import { OtpCookieConfig } from 'src/common/utility/cookie.utiliti';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
  ) {}

  async sendOtp(SendOtpDto: SendOtpDto, res: Response) {
    let { phone } = SendOtpDto;
    let user = await this.userRepository.findOneBy({ phone });
    if (!user) {
      user = this.userRepository.create({ phone });
      user = await this.userRepository.save(user);
    }
    // sms code for phone number
    await this.createOtpForUser(user.id, res);
  }
  async setOtpCookie(userId: number, code: string, res: Response) {
    const token = await this.tokenService.createOtpToken({ userId });
    res
      .cookie(CookieNames.OtpToken, token, OtpCookieConfig)
      .status(HttpStatus.OK)
      .json({
        message: PublicMessage.SendOtp,
        code,
      });
  }

  async createOtpForUser(userId: number, res: Response) {
    let otp = await this.otpRepository.findOneBy({ userId });
    let code = randomInt(10000, 99999).toString();
    let expires_in = new Date(new Date().getTime() + 2 * 1000 * 60);
    let otpExist = false;
    if (otp) {
      if (otp.expires_in > new Date())
        throw new UnauthorizedException(AuthMessage.OtpCodeNotExpired);
      otpExist = true;
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({ userId, code, expires_in });
    }
    otp = await this.otpRepository.save(otp);
    if (!otpExist)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    this.setOtpCookie(userId, otp.code, res);
  }

  async checkOtp(CheckOtpDto: CheckOtpDto) {
    const { code } = CheckOtpDto;
    const otpToken = this.request.cookies?.[CookieNames.OtpToken];
    if (!otpToken) throw new UnauthorizedException(AuthMessage.ExpiredOtp);
    const { userId } = await this.tokenService.verifyOtpToken(otpToken);
  
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    if (otp.expires_in < new Date())
      throw new UnauthorizedException(AuthMessage.ExpiredOtp);
    await this.userRepository.update({id:userId},{phone_verify:true});

    // create tokens
    return 'created tokens'
  }
}
