import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty } from 'class-validator'
import { PageOptionsDto } from '@/common/dto/page.dto'

export class ListSearchDto extends PageOptionsDto {
  @ApiProperty({
    description: '角色名称关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  keywords?: string

  @ApiProperty({
    description: '角色备注关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  remark?: string
}

export class InfoRoleDto {
  @ApiProperty({
    description: '角色ID',
    required: false
  })
  @IsString()
  @Type(() => String)
  id?: string
}
