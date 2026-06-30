//* Importing necessary decorators and enums for authentication and authorization
import { SetMetadata, UseGuards } from '@nestjs/common';
import { TokenTypeEnum } from '../enum/token.enum';
import { RoleEnum } from '../enum/user.enum';
import { applyDecorators } from '@nestjs/common';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';


//* Defining constants for metadata keys used in authentication and authorization decorators
export const token_Type_Key = 'tokenType';
export const role_Type_Key = 'access_role';

//* TokenType decorator is used to specify the type of token required for a route (access token or refresh token)
export const TokenType = (
  tokenType: TokenTypeEnum = TokenTypeEnum.access_token,
) => {
  return SetMetadata(token_Type_Key, tokenType);
};

//* roleType decorator is used to specify the required user roles for a route, allowing for role-based access control
export const roleType = (access_role: RoleEnum[]) => {
  return SetMetadata(role_Type_Key, access_role);
};

//* Auth decorator combines the TokenType and roleType decorators along with the necessary guards for authentication and authorization, providing a convenient way to secure routes based on token type and user roles
export function Auth({token_Type_Key, role_Type_Key} : {token_Type_Key : TokenTypeEnum, role_Type_Key : RoleEnum[]}) {
  return applyDecorators(
  TokenType(token_Type_Key), //* Specifies the type of token required for this route (access token)
  roleType(role_Type_Key), //* Specifies the required user role for this route (user role)
  UseGuards(AuthenticationGuard, AuthorizationGuard) //* Applies authentication and authorization guards to protect this route
  );
}
