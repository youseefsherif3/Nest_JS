import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repository/user.repository ';
import { createClient } from 'redis';
import RedisService from 'src/common/service/redis.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [UserModel , RedisModule],
  controllers: [UserController],
  providers: [UserService, RedisService, UserRepository],
  exports: [],
})
export class UserModule {}
