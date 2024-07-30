import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOtpPayload, JWTPayload, Tokens } from './types/payload.type';
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
  verifyOtpToken(token: string): Promise<CookieOtpPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.OTP_JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    }
  }
  async createJwtTokens(payload: JWTPayload):Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: '7d',
      }),
    ]);
    return {
        access_token:at,
        refresh_token:rt
    }
  }
}
