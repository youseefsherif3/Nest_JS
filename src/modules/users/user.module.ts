//* Importing necessary modules and decorators from NestJS
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repository/user.repository ';
import RedisService from 'src/common/service/redis.service';
import { RedisModule } from 'src/common/redis/redis.module';
import TokenService from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { Request } from 'express';
import { S3Service } from 'src/common/service/s3.service';

//* UserModule class is a NestJS module that encapsulates user-related functionality, including controllers, services, and repositories
@Module({
  imports: [UserModel, RedisModule],
  controllers: [UserController],
  providers: [
    UserService,
    RedisService,
    UserRepository,
    TokenService,
    JwtService,
    S3Service,
  ],
  exports: [],
})

//* UserModule class is exported to be used in other parts of the application
export class UserModule {}
