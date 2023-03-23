import { FactoryProvider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants'
import { ConfigurationKeyPaths } from '@/config/configuration'

/**
 * 提供使用 @Inject(ROOT_ROLE_ID) 直接获取RootRoleId
 */
export function rootRoleIdProvider(): FactoryProvider {
  return {
    provide: ROOT_ROLE_ID,
    useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => {
      return configService.get<string>('rootRoleId', 'c61fad2f-56ed-4efd-bb06-890f8bc6d2e2')
    },
    inject: [ConfigService]
  }
}
