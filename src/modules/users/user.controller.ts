import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidUnknownValues: true }))
  createUser(@Body() body: CreateUserDto): object {
    return this.userService.createUser(body);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}

