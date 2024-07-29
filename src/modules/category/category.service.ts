import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/messages.enum';
import { S3Service } from '../s3/s3.service';
import slugify from 'slugify';

export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    CreateCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    let { title,parentId } = CreateCategoryDto;

    const resultUploadImage = await this.s3Service.uploadFile(
      image,
      'snapFood/categories',
    );
    let slug=slugify(title,{replacement:'_',lower:true});
    slug=await this.checkEXistBySlug(slug);
    let parent=null
    if(parentId && !isNaN(parentId)){
      parent=await this.findOneById(parentId);
    }
    const newCategory=this.categoryRepository.create({
        title,
        slug,
        parentId:parent?.id,
        image:resultUploadImage.Location
    })
    await this.categoryRepository.save(newCategory);
    return {
      message:PublicMessage.Insert
    }
  }

  async checkEXistBySlug(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    if (category) throw new ConflictException(ConflictMessage.Slug);
    return slug;
  }
  async findAll(){
    const [categories,count]=await this.categoryRepository.findAndCount({
      where:{},
      relations:{
        parent:true
      },
      select:{
        parent:{
          id:true,
          title:true
        }
      }
    })

    return {
      categories
    }
  }
  async findOneById(id:number){
    const category=await this.categoryRepository.findOne({where:{id}});
    if(!category) throw new NotFoundException(NotFoundMessage.Category)
    return category;
  }
}
