import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  registerDecorator,
  Validate,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GenderEnum, RoleEnum } from 'src/common/enum/user.enum';

@ValidatorConstraint({ name: 'matchValue', async: false })
export class matchValue implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return args.value == args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}

export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: matchValue,
    });
  };
}

export class CreateUserDto {
  @Length(3, 20)
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @ValidateIf((data: CreateUserDto) => {
    return Boolean(data.password);
  })
  @IsMatch(['password'], { message: 'confirmPassword must match password' })
  confirmPassword: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsPhoneNumber('EG', {
    message: 'phone must be a valid Egyptian phone number',
  })
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([GenderEnum.male, GenderEnum.female])
  gender: GenderEnum;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn([RoleEnum.user, RoleEnum.admin])
  role: RoleEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileImage: string;
}
