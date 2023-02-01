import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigurationKeyPaths, getConfiguration } from './config/configuration'

import { RedisModule } from './common/libs/redis/redis.module'
import { RedisClientOptions } from '@liaoliaots/nestjs-redis'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConfiguration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env']
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigurationKeyPaths>) => ({
        autoLoadEntities: true, // 自动注入表实体
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
        timezone: configService.get('database.timezone') // 时区
      })
    }),
    // libs redis
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            closeClient: true,
            config: configService.get<RedisClientOptions>('redis')
          }
        }
      },
      true
    ),
    AdminModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
