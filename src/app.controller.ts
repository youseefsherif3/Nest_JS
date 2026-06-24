//* Importing necessary modules and decorators
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//* AppController class to handle HTTP requests for the application
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }
}
