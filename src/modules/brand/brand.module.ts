//* Importing necessary modules and services for the BrandModule
import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import TokenService from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repository/user.repository ';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repository/brand.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/service/s3.service';

//* BrandModule class to encapsulate the brand related components and services
@Module({
  imports: [UserModel , BrandModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    TokenService,
    JwtService,
    UserRepository,
    BrandRepository,
    S3Service
  ],
})

//* Exporting the BrandModule class to be used in other parts of the application
export class BrandModule {}
