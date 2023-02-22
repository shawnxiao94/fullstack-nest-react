import { Module } from '@nestjs/common'
import { SystemModule } from '../system/system.module'
import { LoginService } from './login.service'
import { LoginController } from './login.controller'

import { UtilService } from '@/common/utils/utils.service'

@Module({
  imports: [SystemModule],
  controllers: [LoginController],
  providers: [LoginService, UtilService],
  exports: [LoginService]
})
export class LoginModule {}
