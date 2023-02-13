import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsArray } from 'class-validator'
import { PageOptionsDto } from '@/common/dto/page.dto'

export class ListPageSearchDto extends PageOptionsDto {
  @ApiProperty({
    description: '菜单name/title关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  keywords: string
}

export class ListSearchDto {
  @ApiProperty({
    description: '菜单name/title关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  keywords: string
}

export class InfoIdDto {
  @ApiProperty({
    description: '菜单ID',
    required: true
  })
  @IsString()
  @Type(() => String)
  id: string
}

export class MenuIdsDto {
  @ApiProperty({
    description: '菜单IDs',
    required: true
  })
  @IsArray({ message: 'menuIds 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '菜单组内类型错误' })
  @IsNotEmpty({ each: true, message: '菜单id 不能为空' })
  menuIds: string[]
}

export class parentMenuIdDto {
  @ApiProperty({ description: '父级菜单id', required: true, default: 'root' })
  @IsString({ message: 'parent 类型错误' })
  @IsNotEmpty({ message: 'parentId 必须填入值' })
  parentId: string
}
