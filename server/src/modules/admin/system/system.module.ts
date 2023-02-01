import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './user/entities/user.entity'
import { UserService } from './user/user.service'
import { UserController } from './user/user.controller'

import { RoleEntity } from './role/entities/role.entity'
import { RoleService } from './role/role.service'
import { RoleController } from './role/role.controller'

import { DeptEntity } from './dept/entities/dept.entity'
import { DeptService } from './dept/dept.service'
import { DeptController } from './dept/dept.controller'

@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity, UserEntity, RoleEntity])],
  controllers: [DeptController, UserController, RoleController],
  providers: [DeptService, UserService, RoleService],
  exports: []
})
export class SystemModule {}
