import { Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class BaseEntityModel {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'create_time'
  })
  @ApiProperty({ description: '创建时间' })
  public createTime: Date

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'update_time'
  })
  @ApiProperty({ description: '更新时间' })
  public updateTime: Date
}

@Entity()
export class BaseEntityModelWithUUIDPrimary extends BaseEntityModel {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string
}
