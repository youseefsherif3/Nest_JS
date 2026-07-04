//* Importing necessary modules and services for the CategoryModule
import { Module } from '@nestjs/common';
import TokenService from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repository/user.repository ';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repository/brand.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/service/s3.service';
import CategoryRepository from 'src/DB/repository/category.repository';
import { CategoryModel } from 'src/DB/models/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

//* CategoryModule class to encapsulate the category related components and services
@Module({
  imports: [UserModel, BrandModel, CategoryModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    TokenService,
    JwtService,
    UserRepository,
    BrandRepository,
    S3Service,
    CategoryRepository,
  ],
})

//* Exporting the CategoryModule class to be used in other parts of the application
export class CategoryModule {}
