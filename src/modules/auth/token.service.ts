import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookieOtpPayload } from "./types/payload.type";

@Injectable()
export class TokenService {
    constructor(private jwtService:JwtService){}


    createOtpToken(payload:CookieOtpPayload){
        return this.jwtService.signAsync(payload,{
            secret:process.env.OTP_JWT_SECRET_KEY,
            expiresIn:'2m'
        })

    }
}