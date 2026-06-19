import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';


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
  exports: ["REDIS_SERVICE"],
})
export class RedisModule {}
