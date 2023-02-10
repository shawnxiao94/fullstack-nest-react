import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { UserEntity } from '../../user/entities/user.entity'

@Entity({ name: 'sys_action_log' })
export class ActionLogEntity extends BaseEntityModelWithUUIDPrimary {
  @Column({
    nullable: true,
    type: 'varchar',
    comment: '操作系统'
  })
  os: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '浏览器'
  })
  browser: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '浏览器ua'
  })
  ua: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'IP地址'
  })
  ip: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '定位地址'
  })
  location: string

  // 操作人
  @ManyToOne(() => UserEntity, (user) => user.actionLogs)
  @JoinColumn({
    name: 'user_id'
  })
  user: UserEntity

  @Column({
    name: 'login_time',
    nullable: true,
    type: 'timestamp',
    default: null,
    comment: '登录时间'
  })
  loginTime: Date
}
