import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from 'src/configs/typeOrm.config';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass:TypeOrmDbConfig,
      inject:[TypeOrmDbConfig]
    }),
    CategoryModule,
    
  ],
  providers:[TypeOrmDbConfig]
})
export class AppModule {}
