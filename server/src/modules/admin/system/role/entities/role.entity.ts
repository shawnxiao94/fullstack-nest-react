import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../../user/entities/user.entity'
import { MenuEntity } from '../../menu/entities/menu.entity'

@Entity({ name: 'sys_role' })
export class RoleEntity extends BaseEntityModelWithUUIDPrimary {
  @Column({ unique: true, type: 'varchar', length: 100, comment: '角色名称' })
  @ApiProperty({ description: '角色名称' })
  name: string

  @ApiProperty({ description: '角色编号' })
  @Column({ type: 'varchar', length: 50, comment: '角色编号' })
  code: string

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: Array<UserEntity>

  // 菜单
  // 指定多对多关系
  @ManyToMany((type) => MenuEntity, (menu) => menu.roles, { cascade: true })
  @JoinTable({
    // 定义与其他表的关系
    // name 用于指定创中间表的表名
    name: 'role_menu',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'menu_id' }]
  })
  menus: MenuEntity[]

  @Column({ nullable: true, type: 'varchar', length: 100, default: '', comment: '角色备注' })
  @ApiProperty({ description: '角色备注' })
  remark: string
}
