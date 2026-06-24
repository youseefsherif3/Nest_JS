//* Importing necessary modules and types
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//* Setting the port for the application
const port = process.env.PORT ?? 3001;

//* Bootstrap function to initialize the NestJS application and start listening on the specified port
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

//* Calling the bootstrap function to start the application
bootstrap();
