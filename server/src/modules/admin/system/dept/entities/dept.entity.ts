import { BaseEntityModelWithUUIDPrimary } from '@/common/BaseEntityModel'
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../../user/entities/user.entity'
import { $enum } from 'ts-enum-util'
import { StatusValue, UserType } from '@/common/enums/common.enum'

@Entity({ name: 'sys_dept' })
export class DeptEntity extends BaseEntityModelWithUUIDPrimary {
  @ApiProperty({ description: '上级部门 id', default: 'root' })
  @Column({ name: 'parent_id', type: 'varchar', length: 100, comment: '父级部门 id' })
  parentId: string

  @ApiProperty({ description: '部门名称' })
  @Column({ type: 'varchar', length: 50, comment: '部门名称' })
  name: string

  @ApiProperty({ description: '部门编号' })
  @Column({ type: 'varchar', length: 50, comment: '部门编号' })
  code: string

  @ApiProperty({ description: '状态', enum: $enum(StatusValue).getValues() })
  @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '部门状态，1-有效，0-禁用' })
  status: StatusValue

  @ApiProperty({ description: '排序' })
  @Column({ name: 'order_num', type: 'int', comment: '排序', default: 0 })
  orderNum: number

  // 部门负责人
  @ManyToOne(() => UserEntity, (user) => user.department)
  @JoinColumn()
  leader: string

  // 部门成员
  @OneToMany(() => UserEntity, (user) => user.dept)
  members: UserEntity[]

  @ApiProperty({ description: '备注' })
  @Column({ type: 'text', comment: '备注' })
  remark: string
}
