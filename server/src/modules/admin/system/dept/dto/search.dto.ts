import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { IsString, IsBoolean, IsNotEmpty, IsIn, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { StatusValue } from '@/common/enums/common.enum'
import { PageOptionsDto } from '@/common/dto/page.dto'

export class FindListDto extends PageOptionsDto {
  @ApiProperty({
    description: '部门/备注关键词模糊搜索',
    required: true
  })
  @IsString()
  keywords: string

  @ApiProperty({ description: '状态,1-有效，0-禁用', required: false, default: 1, enum: $enum(StatusValue).getValues() })
  status: StatusValue
}

export class InfoByIdDto {
  @ApiProperty({
    description: '部门ID',
    required: true
  })
  @IsString()
  @Type(() => String)
  id: string

  @ApiProperty({ description: '状态,1-有效，0-禁用', required: false, default: 1, enum: $enum(StatusValue).getValues() })
  status: StatusValue

  @ApiProperty({
    description: '是需要关联的部门领导',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireLeader: boolean

  @ApiProperty({
    description: '是需要关联的部门成员',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireMembers: boolean
}

export class parentIdDto {
  @ApiProperty({ description: '父级部门id', required: true, default: 'root' })
  @IsString({ message: 'parent 类型错误' })
  @IsNotEmpty({ message: 'parentId 必须填入值' })
  parentId: string

  @ApiProperty({
    description: '是需要部门成员',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireMembers: boolean
}
