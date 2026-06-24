//* Importing necessary modules and decorators
import { Injectable } from '@nestjs/common';

//* AppService class to handle application-level services
@Injectable()
export class AppService {
  getHello(): object {
    return { message: 'Hello World!' };
  }
}
