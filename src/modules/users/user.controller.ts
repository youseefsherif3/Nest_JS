//* Importing necessary modules and decorators from NestJS
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SignInDto } from './dto/createUser.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { roleType, TokenType } from 'src/common/decorators/auth.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RoleEnum } from 'src/common/enum/user.enum';

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
  @TokenType() //* Specifies the type of token required for this route (access token)
  @roleType([RoleEnum.user]) //* Specifies the required user role for this route (user role)
  @UseGuards(AuthenticationGuard, AuthorizationGuard) //* Applies authentication and authorization guards to protect this route
  getAllUsers(@Req() req: any) {
    return this.userService.getAllUsers();
  }

  //* signIn method handles the POST request for user sign-in
  @Post('signIn')
  signIn(@Body() body: SignInDto): object {
    return this.userService.signIn(body);
  }
}
