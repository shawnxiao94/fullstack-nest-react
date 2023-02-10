import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, BeforeInsert, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

import { $enum } from 'ts-enum-util'
import { StatusValue, UserType } from '@/common/enums/common.enum'

import { DeptEntity } from '../../dept/entities/dept.entity'
import { RoleEntity } from '../../role/entities/role.entity'
import { ActionLogEntity } from '../../action-log/entities/action-log.entity'

@Entity({ name: 'sys_user' })
export class UserEntity extends BaseEntityModelWithUUIDPrimary {
  @Column({ length: 100, nullable: true })
  @ApiProperty({ type: String, description: '名称' })
  name: string

  @Column({ unique: true })
  @ApiProperty({ type: String, description: '用户名' })
  username: string

  @Exclude()
  @Column()
  @ApiProperty({ type: String, description: '密码' })
  password: string

  @Column({ name: 'nick_name', nullable: true })
  @ApiProperty({ type: String, description: '昵称' })
  nickName: string

  @Column({ type: 'varchar', comment: '头像地址', nullable: true })
  @ApiProperty({ type: String, description: '头像url' })
  avatar: string

  @Column({ nullable: true, default: '' })
  @ApiProperty({ type: String, description: '邮箱' })
  email: string

  @Column({ nullable: true, default: '' })
  @ApiProperty({ type: String, description: '手机' })
  mobile: string

  @Column({ nullable: true, default: '' })
  @ApiProperty({ type: String, description: '备注' })
  remark: string

  @ApiProperty({ type: Number, description: '帐号类型：0-超管， 1-普通用户', enum: $enum(UserType).getValues() })
  @Column({ type: 'tinyint', default: UserType.ORDINARY_USER, comment: '帐号类型：0-超管， 1-普通用户' })
  public type: UserType

  @ApiProperty({ type: String, description: '所属状态: 1-有效，0-禁用', enum: $enum(StatusValue).getValues() })
  @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-有效，0-禁用' })
  public status: StatusValue

  @Column({ nullable: true })
  address: string

  @Column({ default: null })
  openid: string

  // 所属的部门
  @ManyToOne(() => DeptEntity, (dept) => dept.members, {
    // cascade: true,
  })
  @JoinColumn({
    name: 'dept_id'
  })
  dept: DeptEntity

  // actionLog
  @OneToMany(() => ActionLogEntity, (logs) => logs.user)
  actionLogs: ActionLogEntity[]

  // 角色
  // 指定多对多关系
  /**
   * 关系类型，返回相关实体引用
   * cascade: true，插入和更新启用级联，也可设置为仅插入或仅更新
   * ['insert']
   */
  @ManyToMany((type) => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable({
    // 定义与其他表的关系
    // name 用于指定创中间表的表名
    name: 'user_role',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }]
  })
  roles: RoleEntity[]

  // 通过生命周期把密码加密再存入库
  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return
    this.password = await bcrypt.hashSync(this.password, 10)
  }
}
