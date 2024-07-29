import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { SendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { PublicMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
  ) {}

  async sendOtp(SendOtpDto: SendOtpDto) {
    let { phone } = SendOtpDto;
    let user = await this.userRepository.findOneBy({ phone });
    if (!user) {
      user = this.userRepository.create({ phone });
      user = await this.userRepository.save(user);
    }
    let otpCode = await this.createOtpForUser(user.id);
    return {
      message: PublicMessage.SendOtp,
      code: otpCode,
    };
  }

  async createOtpForUser(userId: number) {
    let otp = await this.otpRepository.findOneBy({ userId });
    let code = randomInt(10000, 99999).toString();
    let expires_in = new Date(new Date().getTime() + 2 * 1000 * 60);
    let otpExist = false;
    if (otp) {
      otpExist = true;
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({ userId, code, expires_in });
    }
    otp = await this.otpRepository.save(otp);
    if (!otpExist)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });

    return otp.code;
  }
}
