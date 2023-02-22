import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator'

export class RetrieveUserDto {
  @ApiProperty({
    description: '用户ID',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: '缺少用户id' })
  @Type(() => String)
  id: string
}

export class UpdateUserAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly avatar: string
}

export class InfoSearchDto {
  @ApiProperty({
    description: '用户ID',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: '缺少用户id' })
  @Type(() => String)
  id: string

  @ApiProperty({
    description: '是需要关联角色',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireRoles: boolean

  @ApiProperty({
    description: '是需要关联部门',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireDept: boolean
}
