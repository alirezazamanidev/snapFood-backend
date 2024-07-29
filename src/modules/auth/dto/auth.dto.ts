import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone('fa-IR')
  phone: string;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(5, 5)
  @IsString()
  code: string;
}
