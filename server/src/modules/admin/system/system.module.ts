import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// 后台系统用户
import { UserEntity } from './user/entities/user.entity'
import { UserService } from './user/user.service'
import { UserController } from './user/user.controller'

// 角色
import { RoleEntity } from './role/entities/role.entity'
import { RoleService } from './role/role.service'
import { RoleController } from './role/role.controller'

// 部门
import { DeptEntity } from './dept/entities/dept.entity'
import { DeptService } from './dept/dept.service'
import { DeptController } from './dept/dept.controller'

// 菜单
import { MenuEntity } from './menu/entities/menu.entity'
import { MenuService } from './menu/menu.service'
import { MenuController } from './menu/menu.controller'

// 操作日志
import { ActionLogEntity } from './action-log/entities/action-log.entity'
import { ActionLogService } from './action-log/action-log.service'
import { ActionLogController } from './action-log/action-log.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeptEntity, RoleEntity, MenuEntity, ActionLogEntity])],
  controllers: [DeptController, UserController, RoleController, MenuController, ActionLogController],
  providers: [UserService, DeptService, RoleService, MenuService, ActionLogService],
  exports: [UserService, RoleService, DeptService]
})
export class SystemModule {}
