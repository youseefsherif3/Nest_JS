//* Importing necessary decorators and classes from NestJS and Zod
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
} from '@nestjs/common';
import { ZodType } from 'zod';

//* ZodValidationPipe class is a NestJS pipe that implements the PipeTransform interface to validate incoming request data against a Zod schema, throwing an HttpException if validation fails.
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { success, error } = this.schema.safeParse(value);

    if (!success) {
      throw new HttpException(
        {
          message: 'Validation failed',
          error: error.issues.map((issue) => {
            return {
              path: issue.path,
              message: issue.message,
            };
          }),
        },
        400,
      );
    }

    return value;
  }
}
