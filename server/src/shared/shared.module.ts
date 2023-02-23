import { Global, CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UtilService } from '@/common/utils/utils.service'
import { ConfigurationKeyPaths } from '@/config/configuration'

// common provider list
const providers = [UtilService]

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    // HttpModule.register({
    //   timeout: 5000,
    //   maxRedirects: 5
    // }),
    // redis cache
    CacheModule.register(),
    // jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => ({
        secret: configService.get<string>('jwt.secret')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [...providers],
  exports: [CacheModule, JwtModule, ...providers]
})
export class SharedModule {}
