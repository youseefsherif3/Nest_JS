//* Importing necessary modules and decorators from NestJS
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SignInDto } from './dto/createUser.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import {
  Auth,
  roleType,
  TokenType,
} from 'src/common/decorators/auth.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { type UserDocument } from 'src/DB/models/user.model';
import { TokenTypeEnum } from 'src/common/enum/token.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { Request } from 'express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Store_Enum } from 'src/common/enum/multer.enum';

//* UserController class handles user-related HTTP requests and routes
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //* createUser method handles the POST request to create a new user
  @Post('signUp')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidUnknownValues: true }))
  createUser(@Body() body: CreateUserDto): object {
    return this.userService.createUser(body);
  }

  //* getAllUsers method handles the GET request to retrieve all users
  @Get()
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.user],
  })
  getAllUsers(@Req() req: any) {
    return this.userService.getAllUsers();
  }

  //* signIn method handles the POST request for user sign-in
  @Post('signIn')
  signIn(@Body() body: SignInDto): object {
    return this.userService.signIn(body);
  }

  @Get('profile')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.user],
  })
  getProfile(@User() user: UserDocument) {
    return this.userService.getProfile(user);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfileImage(file);
  }
}
