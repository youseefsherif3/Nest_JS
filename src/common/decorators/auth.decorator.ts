//* Importing necessary decorators and enums for authentication and authorization
import { SetMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../enum/token.enum';
import { RoleEnum } from '../enum/user.enum';

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
