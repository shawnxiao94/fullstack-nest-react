import { Module } from '@nestjs/common'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { AuthGuard } from './core/guards/auth.guard'
import { SystemModule } from './system/system.module'
import { ADMIN_PREFIX } from './admin.constants'
import { LoginModule } from './login/login.module'

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({
  imports: [
    // register prefix
    RouterModule.register([
      {
        path: ADMIN_PREFIX,
        children: [{ path: 'sys', module: SystemModule }]
      },
      // like this url /admin/captcha/img
      {
        path: ADMIN_PREFIX,
        module: LoginModule
      }
    ]),
    // component module
    LoginModule,
    // 系统基础模块
    SystemModule
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard
  //   }
  // ],
  exports: [SystemModule]
})
export class AdminModule {}
