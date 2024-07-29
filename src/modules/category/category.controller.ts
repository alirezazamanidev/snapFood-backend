import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ContentType, SwaggerTags } from "src/common/enums/swagger..enum";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UploadFileS3 } from "src/common/interceptors/uploadFile.interceptor";

@ApiTags(SwaggerTags.Category)
@Controller('/category')
export class CategoryController {

    constructor(private readonly categoryService:CategoryService){}

    @UseInterceptors(UploadFileS3('image'))
    
    @ApiConsumes(ContentType.Multipart)
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    create(@Body() CreateCategoryDto:CreateCategoryDto,
    @UploadedFile(
        new ParseFilePipe(
            {
                validators:[
                    new MaxFileSizeValidator({maxSize:10*1024*1024}),
                    new FileTypeValidator({fileType:'image/(png|jpg|jepg|webp)'})
                ]
            }
        )
    ) image:Express.Multer.File
    ){
        return this.categoryService.create(CreateCategoryDto,image);

    }
    @HttpCode(HttpStatus.OK)
    @Get('/list')
    listOfCategories(){
        return  this.categoryService.findAll();
    }

}