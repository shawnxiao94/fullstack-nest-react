import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { RoleEntity } from '../../role/entities/role.entity'
import { MenuType } from '@/common/enums/common.enum'

@Entity({ name: 'sys_menu' })
export class MenuEntity extends BaseEntityModelWithUUIDPrimary {
  @Column({ name: 'parent_id', nullable: true, default: 0 })
  @ApiProperty({ description: '父级菜单id' })
  parentId: string

  @ApiProperty({ description: '菜单类型 1-菜单/目录 2-tabs 3-按钮' })
  @Column({ type: 'int', default: 1, comment: '菜单类型， 1-菜单/目录 2-tabs 3-按钮' })
  public type: MenuType

  @ApiProperty({ description: '路由名称,路由/菜单标识，前端路由name,按钮唯一标识' })
  @Column({ type: 'varchar', length: 30, comment: '路由名称', unique: true })
  name: string

  @Column({ comment: '路由地址', nullable: true })
  @ApiProperty({ description: '路由地址' })
  path: string

  @Column({ name: 'component_path', comment: '组件地址', nullable: true })
  componentPath: string

  @Column({ comment: '菜单名称' })
  title: string

  @Column({ comment: '菜单图标', nullable: true })
  icon: string

  @Column({ comment: '重定向路径', nullable: true })
  redirect: string

  @Column({ comment: '是否外链，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`', nullable: true })
  isLink: string

  @Column({ comment: '是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`' })
  isIframe: boolean

  @Column({ comment: '是否隐藏路由', type: 'boolean', nullable: true, default: true })
  @ApiProperty()
  hidden: boolean

  @Column({ type: 'boolean', comment: '是否缓存组件状态', nullable: true, default: true })
  @ApiProperty()
  keepalive: boolean

  @Column({ comment: '路由层级', nullable: true, type: 'int', default: 0 })
  level: number

  @Column({ name: 'sort', comment: '排序', type: 'int', default: 0, nullable: true })
  @ApiProperty({ description: '排序' })
  sort: number

  @Column({ name: 'open_mode', type: 'tinyint', nullable: true, default: 1 })
  @ApiProperty({ description: '外链打开方式' })
  openMode: number

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: Array<RoleEntity>
}
