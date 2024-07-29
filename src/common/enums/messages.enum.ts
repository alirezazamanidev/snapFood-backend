

export enum ConflictMessage {
    Slug='چنین موردی قیلا با این اسلاگ ثبت شده است!'
}

export enum PublicMessage {
    Insert='با موفقیت ایجاد شد!',
    Updated='با موفقیت ویرایش شد!',
    SendOtp='کد تایید با موفقیت ارسال شد!'
}
export enum NotFoundMessage{
    Category='دسته ای یافت نشد!'
}
export enum AuthMessage {
    OtpCodeNotExpired='کد تایید هنوز منقضی نشده است!',
    ExpiredOtp='کد تایید منقضی شده است لطفا دوباره تلاش کنید!',
    OtpInCurrent='کد تایید نادرست است!'
}