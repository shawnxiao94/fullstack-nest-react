import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../../user/entities/user.entity'

@Entity({ name: 'sys_role' })
export class RoleEntity extends BaseEntityModelWithUUIDPrimary {
  @Column({ unique: true, type: 'varchar', length: 100, comment: '角色名称' })
  @ApiProperty({ description: '角色名称' })
  name: string

  @ApiProperty({ description: '角色编号' })
  @Column({ type: 'varchar', length: 50, comment: '角色编号' })
  code: string

  @ManyToMany(() => UserEntity, (user) => user.roles)
  userId: Array<UserEntity>

  // @Column({ type: 'bigint', name: 'menu_id', comment: '菜单 id' })
  // menuId: string

  @Column({ nullable: true, type: 'varchar', length: 100, default: '', comment: '角色备注' })
  @ApiProperty({ description: '角色备注' })
  remark: string
}
