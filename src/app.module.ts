//* Importing necessary modules and decorators
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/categories/category.module';

//* AppModule class to define the main application module and its dependencies
@Module({
  imports: [
    UserModule,
    //* ConfigModule is configured to load environment variables from .env.development and .env.production files, and it is set to be global so that the configuration can be accessed throughout the application
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
    }),
    //* MongooseModule is configured to connect to the MongoDB database
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => {
          console.log(
            `DataBase Connected Successfully On URL ${process.env.MONGO_URI}`,
          );
        });
        return connection;
      },
    }),
    BrandModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

//* AppModule class is exported to be used in the main application bootstrap
export class AppModule {}
