import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(3,20)
    title:string
    @ApiPropertyOptional({type:String,format:'binary'})
    image:Express.Multer.File


    @ApiPropertyOptional()
    parentId:number
}