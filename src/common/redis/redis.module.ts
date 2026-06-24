//* Importing necessary decorators and classes from NestJS
import { Module } from '@nestjs/common';
import { createClient } from 'redis';

//* RedisModule class is a NestJS module that provides a Redis client service, allowing other parts of the application to connect to and interact with a Redis database.
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'REDIS_SERVICE',
      useFactory: async () => {
        const redis = await createClient({
          url: process.env.REDIS_URL,
        });

        redis.on('error', (err) => console.error('Redis Client Error', err));
        await redis.connect();
        console.log('Successfully Connected To Redis ');

        return redis;
      },
    },
  ],
  exports: ['REDIS_SERVICE'],
})

//* RedisModule class is exported to be used in other parts of the application, allowing them to inject the Redis client service for database operations.
export class RedisModule {}
