import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { S3Service } from '../s3/s3.service';
import slugify from 'slugify';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utility/pagination.utilis';
import { UpdateCategoryDto } from './dtos/update-category.dto';

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
    let { title, parentId } = CreateCategoryDto;

    const resultUploadImage = await this.s3Service.uploadFile(
      image,
      'snapFood/categories',
    );
    let slug = slugify(title, { replacement: '_', lower: true });
    slug = await this.checkEXistBySlug(slug);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(parentId);
    }
    const newCategory = this.categoryRepository.create({
      title,
      slug,
      parentId: parent?.id,
      image: resultUploadImage.Location,
      imageKey: resultUploadImage.Key,
    });
    await this.categoryRepository.save(newCategory);
    return {
      message: PublicMessage.Insert,
    };
  }

  async update(
    UpdateCategoryDto: UpdateCategoryDto,
    id: number,
    image: Express.Multer.File,
  ) {
    let { parentId, title } = UpdateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'snapFood/categories',
      );
      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;

        await this.s3Service.deleteFile(category?.imageKey);
      }
    }
    if (title) {
      updateObject['title'] = title;
      updateObject['slug'] = slugify(title, { replacement: '_', lower: true });
    }
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      updateObject['parentId'] = (await this.findOneById(parentId)).id;
    }
    await this.categoryRepository.update({id},updateObject);
    return {
      message:PublicMessage.Updated
    }
  }

  async checkEXistBySlug(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    if (category) throw new ConflictException(ConflictMessage.Slug);
    return slug;
  }
  async findAll(paginationDto: PaginationDto) {
    let { page, limit, skip } = paginationSolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      skip,
      take: limit,

      select: {
        parent: {
          id: true,
          title: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });

    return {
      categories,
      pagination: paginationGenerator(count, page, limit),
    };
  }
  async findOneById(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(NotFoundMessage.Category);
    return category;
  }
}
