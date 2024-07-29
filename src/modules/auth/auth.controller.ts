import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger..enum';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { Response } from 'express';

@ApiTags(SwaggerTags.Auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  @ApiConsumes(ContentType.UrlEncoded)
  sendOtp(@Body() SendOtpDto:SendOtpDto,@Res() res:Response){
    return this.authService.sendOtp(SendOtpDto,res)
  }
  @HttpCode(HttpStatus.OK)
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  @Post('check-otp')
  checkOtp(@Body() CheckOtpDto:CheckOtpDto){
    return this.authService.checkOtp(CheckOtpDto);
  }
}
