//* Importing necessary decorators and validation functions
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
  ValidateIf,
  ValidationOptions,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GenderEnum, RoleEnum } from 'src/common/enum/user.enum';

//* matchValue class is a custom validator that checks if the value of a property matches the value of another property in the same object
@ValidatorConstraint({ name: 'matchValue', async: false })
export class matchValue implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return args.value == args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}

//* IsMatch function is a decorator that applies the matchValue validator to a property, ensuring that it matches the value of another specified property
export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: matchValue,
    });
  };
}

//* CreateUserDto class defines the structure and validation rules for user creation data transfer object (DTO)
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

//* SignInDto class defines the structure and validation rules for user sign-in data transfer object (DTO) */
export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
