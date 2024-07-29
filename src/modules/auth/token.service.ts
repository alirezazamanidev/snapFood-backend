import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOtpPayload } from './types/payload.type';
import { AuthMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookieOtpPayload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.OTP_JWT_SECRET_KEY,
      expiresIn: '2m',
    });
  }
  verifyOtpToken(token: string):Promise<CookieOtpPayload> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: process.env.OTP_JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    }
  }
}
