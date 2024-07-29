import { CookieOptions } from "express-serve-static-core";


export const OtpCookieConfig:CookieOptions={
    httpOnly: true,
    maxAge: 2 * 1000 * 60 * 60,
    secure:true,
    domain:'',
    path:'/'
  }