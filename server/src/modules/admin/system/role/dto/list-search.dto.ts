import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsArray, IsBoolean } from 'class-validator'
import { PageOptionsDto } from '@/common/dto/page.dto'

export class KeywordsListPageDto extends PageOptionsDto {
  @ApiProperty({
    description: '角色名称/备注关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  keywords: string

  @ApiProperty({ description: '排序字段', required: false })
  @Type(() => String)
  orderBy: string
}

export class KeywordsListDto {
  @ApiProperty({
    description: '角色名称/备注关键词',
    required: false
  })
  @IsString()
  @Type(() => String)
  keywords: string

  @ApiProperty({ description: '排序字段', required: false })
  @Type(() => String)
  orderBy: string
}

export class InfoRoleDto {
  @ApiProperty({
    description: '角色ID',
    required: true
  })
  @IsString()
  @Type(() => String)
  id: string

  @ApiProperty({
    description: '是需要关联菜单标识',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireMenus: boolean

  @ApiProperty({
    description: '关联菜单是否是tree格式',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  treeType: boolean
}

export class InfoArrRoleDto {
  @ApiProperty({
    description: '角色ID数组',
    required: true
  })
  @IsArray({ message: 'ids 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '类型错误' })
  @IsNotEmpty({ each: true, message: '角色ids不能为空' })
  ids: string[]

  @ApiProperty({
    description: '是需要关联菜单标识',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  requireMenus: boolean

  @ApiProperty({
    description: '关联菜单是否是tree格式',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  treeType: boolean
}
