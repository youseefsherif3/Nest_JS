import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repository/user.repository ';
import { HashPassword } from 'src/common/utils/security/hashing.security';
import { EncryptData } from 'src/common/utils/security/encrypt.security';
import { generateOTP, sendEmail } from 'src/common/utils/email/send.email';
import { Eventemitter } from 'src/common/utils/email/email.events';
import { EmailEnum } from 'src/common/enum/user.enum';
import { emailTemplate } from 'src/common/utils/email/email.template';
import RedisService from 'src/common/service/redis.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository , private readonly redisService: RedisService) {}

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
      phone: EncryptData(phone!),
      address,
      password,
    });

    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
