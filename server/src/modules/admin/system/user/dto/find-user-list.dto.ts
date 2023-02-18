import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { IsString, IsIn, IsArray } from 'class-validator'
import { StatusValue } from '@/common/enums/common.enum'
import { PageOptionsDto } from '@/common/dto/page.dto'

export class FindUserListDto extends PageOptionsDto {
  @ApiProperty({
    description: '昵称/账号/备注关键词模糊搜索',
    required: true
  })
  @IsString()
  keywords: string

  @ApiProperty({ description: '状态,1-有效，0-禁用', required: false, default: 1, enum: $enum(StatusValue).getValues() })
  status: StatusValue

  @ApiProperty({
    description: '角色ID数组',
    required: false
  })
  @IsArray({ message: 'roleIds类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '类型错误' })
  roleIds: string[]

  @ApiProperty({
    description: '归属部门',
    required: false,
    type: String
  })
  @IsString({ message: '类型错误' })
  deptId: string
}
