//* Importing necessary modules from class-validator and mongoose
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

//* ValidatorConstraint decorator is used to define a custom validation constraint named 'CustomKey' which is not asynchronous
@ValidatorConstraint({ name: 'CustomKey', async: false })
export class ValidateIds implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments) {
    return (
      value.filter((id) => Types.ObjectId.isValid(id)).length == value.length
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid Ids';
  }
}
