//* Importing necessary decorators and classes from NestJS and other libraries
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import UserRepository from 'src/DB/repository/user.repository ';

//* TokenService class is a NestJS service that provides methods to generate and verify JWT tokens, retrieve secret keys based on user roles, and decode tokens to fetch user information from the database.
@Injectable()
class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  //* Utility function to generate a JWT token with the given payload and options
  generateToken = ({
    payload,
    options,
  }: {
    payload: object;
    options?: JwtSignOptions;
  }): Promise<string> => {
    return this.jwtService.signAsync(payload, options);
  };

  //* Utility function to verify a JWT token with the given token string and options, returning the decoded payload if valid
  verifyToken = ({
    token,
    options,
  }: {
    token: string;
    options?: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return this.jwtService.verifyAsync(token, options);
  };

  //* Method to retrieve the appropriate secret keys for access and refresh tokens based on the provided prefix, which indicates the user role (e.g., user or admin)
  getSignature = async (prefix: string) => {
    let ACCESS_SECRET_KEY = '';
    let REFRESH_SECRET_KEY = '';
    if (prefix == process.env.PREFIX_USER) {
      ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY_USER!;
      REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY_USER!;
    } else if (prefix == process.env.PREFIX_ADMIN) {
      ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY_ADMIN!;
      REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY_ADMIN!;
    } else {
      throw new BadRequestException('Invalid prefix');
    }

    return { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY };
  };

  //* Method to decode a JWT token and fetch the associated user from the database, verifying the token's validity and ensuring the user exists
  decodeToken_and_fetchUser = async (token: string, secret: string) => {
    const decodedToken = (await this.verifyToken({
      token,
      options: { secret },
    })) as any;
    if (!decodedToken?.id) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userRepository.findOne({
      filter: { _id: decodedToken.id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return { user, decodedToken };
  };
}

//* Exporting the TokenService class as the default export of the module, allowing it to be imported and used in other parts of the application for token-related operations.
export default TokenService;
