import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from 'src/configs/typeOrm.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass:TypeOrmDbConfig,
      inject:[TypeOrmDbConfig]
    }),
  ],
  providers:[TypeOrmDbConfig]
})
export class AppModule {}
