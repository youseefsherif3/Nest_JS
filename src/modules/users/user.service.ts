//* Importing necessary modules and decorators from NestJS
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, SignInDto } from './dto/createUser.dto';
import UserRepository from 'src/DB/repository/user.repository ';
import {
  ComparePassword,
  HashPassword,
} from 'src/common/utils/security/hashing.security';
import { EncryptData } from 'src/common/utils/security/encrypt.security';
import { generateOTP, sendEmail } from 'src/common/utils/email/send.email';
import { Eventemitter } from 'src/common/utils/email/email.events';
import { EmailEnum } from 'src/common/enum/user.enum';
import { emailTemplate } from 'src/common/utils/email/email.template';
import RedisService from 'src/common/service/redis.service';
import { randomUUID } from 'node:crypto';
import TokenService from 'src/common/service/token.service';
import { type UserDocument } from 'src/DB/models/user.model';
import { S3Service } from 'src/common/service/s3.service';

//* UserService class handles user-related business logic, including user creation, sign-in, and retrieval of all users
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
  ) {}

  //* createUser method handles the creation of a new user, including email verification and OTP generation
  async createUser(body: CreateUserDto): Promise<any> {
    const {
      userName,
      email,
      age,
      gender,
      role,
      profileImage,
      phone,
      address,
      password,
    }: CreateUserDto = body;

    const userExists = await this.userRepository.findOne({
      filter: { email },
    });

    if (userExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    //* Generating a One-Time Password (OTP) for email verification after successful sign-up
    const OTP = await generateOTP();

    //* Sending a verification email to the user's email address with the generated OTP using the sendEmail utility function and the email template
    Eventemitter.emit(EmailEnum.verification, async () => {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email for Social Connect',
        html: emailTemplate(OTP, userName),
      });

      await this.redisService.setMethod({
        key: this.redisService.OTP_Key(email),
        value: HashPassword({ plainText: OTP.toString() }),
        ttl: 10 * 60,
      });
    });

    const newUser = await this.userRepository.create({
      userName,
      email,
      age,
      gender,
      role,
      profileImage,
      phone: EncryptData(phone),
      address,
      password,
    });

    return newUser;
  }

  //* signIn method handles user sign-in, including password verification and JWT token generation for authentication
  async signIn(body: SignInDto) {
    const { email, password }: SignInDto = body;
    const user = await this.userRepository.findOne({ filter: { email } });

    if (!user) {
      throw new BadRequestException('User not found Or Invalid email');
    }

    if (!ComparePassword({ plainText: password, cipherText: user.password })) {
      throw new BadRequestException('Invalid password');
    }

    const uuid = randomUUID();

    const token = await this.tokenService.generateToken({
      payload: {
        id: user._id,
        email: user.email,
      },
      options: {
        secret:
          user.role === 'admin'
            ? process.env.ACCESS_TOKEN_SECRET_KEY_ADMIN
            : process.env.ACCESS_TOKEN_SECRET_KEY_USER,
        expiresIn: '1h',
        jwtid: uuid,
      },
    });

    const refreshToken = await this.tokenService.generateToken({
      payload: {
        id: user._id,
        email: user.email,
      },
      options: {
        secret:
          user.role === 'admin'
            ? process.env.REFRESH_TOKEN_SECRET_KEY_ADMIN
            : process.env.REFRESH_TOKEN_SECRET_KEY_USER,
        expiresIn: '7d',
        jwtid: uuid,
      },
    });

    return { user, token, refreshToken };
  }

  //* getAllUsers method retrieves all users from the user repository
  async getAllUsers() {
    return this.userRepository.find();
  }

  async getProfile(user: UserDocument) {
    return { user };
  }

  async uploadProfileImage(file: Express.Multer.File) {
    const key = await this.s3Service.uploadFile({
      file,
      path: 'profile-images',
    });
    return { key };
  }
}
