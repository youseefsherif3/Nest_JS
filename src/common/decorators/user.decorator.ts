//* Importing necessary modules from NestJS
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//* User decorator retrieves the user object from the request context
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
