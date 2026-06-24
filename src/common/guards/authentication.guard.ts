//* Importing necessary decorators and classes from NestJS
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import TokenService from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { TokenTypeEnum } from '../enum/token.enum';
import { token_Type_Key } from '../decorators/auth.decorator';

//* AuthenticationGuard class is a NestJS guard that implements the CanActivate interface to handle authentication for incoming requests, verifying the provided token and fetching the associated user.
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tokenType = this.reflector.get(token_Type_Key, context.getHandler());

    let req: any;

    let authorization: string = '';

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req.headers.authorization;
    } else if (context.getType() === 'rpc') {
      req = context.switchToRpc().getContext();
    } else if (context.getType() === 'ws') {
      req = context.switchToWs().getClient();
    }

    if (!authorization) {
      throw new BadRequestException('Authorization header is missing');
    }

    const [prefix, token] = authorization.split(' ');

    if (!prefix || !token) {
      throw new BadRequestException('Invalid authorization header format');
    }

    const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } =
      await this.tokenService.getSignature(prefix);

    const secret =
      tokenType == TokenTypeEnum.access_token
        ? ACCESS_SECRET_KEY
        : REFRESH_SECRET_KEY;

    try {
      var { user, decodedToken } =
        await this.tokenService.decodeToken_and_fetchUser(token, secret);
    } catch (error) {
      throw new BadRequestException({ message: 'Invalid token', error });
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    req.user = user;
    req.decodedToken = decodedToken;

    return true;
  }
}
