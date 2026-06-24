//* Importing necessary decorators and classes from NestJS
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import TokenService from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { role_Type_Key } from '../decorators/auth.decorator';

//* AuthorizationGuard class is a NestJS guard that implements the CanActivate interface to handle authorization for incoming requests, checking if the user's role is authorized to access the requested resource.
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roleType = this.reflector.get(role_Type_Key, context.getHandler());

      let req: any;

      if (context.getType() === 'http') {
        req = context.switchToHttp().getRequest();
      } else if (context.getType() === 'rpc') {
        req = context.switchToRpc().getContext();
      } else if (context.getType() === 'ws') {
        req = context.switchToWs().getClient();
      }

      if (!roleType.includes(req.user.role)) {
        throw new UnauthorizedException('User role not authorized');
      }

      return true;
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Authorization failed',
        error: error.message,
      });
    }
  }
}
