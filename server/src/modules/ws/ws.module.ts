import { Module } from '@nestjs/common'

import { WsGateway } from './ws.gateway'
import { AuthService } from './auth.service'

const providers = [WsGateway, AuthService]

@Module({
  exports: providers,
  providers
})
export class WsModule {}
