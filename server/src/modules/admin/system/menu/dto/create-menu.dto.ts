import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsArray, IsOptional, Length, IsString, IsNumber, IsNumberString, IsNotEmpty, Min, MinLength, ValidateIf } from 'class-validator'
import { $enum } from 'ts-enum-util'
import { MenuType } from '@/common/enums/common.enum'
import { MenuPermDto } from './menu-perm.dto'

export class CreateMenuDto {
  @ApiProperty({ description: '菜单类型 1-菜单/目录 2-tabs 3-按钮', default: 1, enum: $enum(MenuType).getValues(), required: true })
  @IsNumber({}, { message: 'type 类型错误' })
  @IsIn($enum(MenuType).getValues(), { message: 'type 的值只能是 1/2/3，且分别表示菜单/tabs/按钮' })
  @IsNotEmpty()
  readonly type: MenuType

  @ApiProperty({ description: '父级菜单', required: true, default: 'root' })
  @IsString({ message: 'parent 类型错误' })
  @IsNotEmpty({ message: 'parentId 必须填入值' })
  readonly parentId: string

  @ApiProperty({ description: '路由/按钮名称(code)', required: true })
  @IsString()
  @Length(2, 20, { message: 'name 字符长度在 2~20' })
  readonly name: string

  @ApiProperty({ description: '路由地址', required: false })
  @IsString()
  @ValidateIf((o) => o.type !== 3)
  path: string

  @ApiProperty({
    description: '组件地址',
    required: false,
    example: 'views/Home'
  })
  @ValidateIf((o) => o.type !== 3)
  componentPath: string

  @ApiProperty({ description: '重定向路径', required: false })
  @ValidateIf((o) => o.type !== 3)
  redirect: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '菜单/目录/按钮中文名称', required: true })
  title: string

  @ApiProperty({
    description: '菜单图标class名',
    example: 'icon-home',
    required: false
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type !== 3)
  icon: string

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: '排序传值错误' })
  @Min(0)
  sort: number

  @ApiProperty({ description: '路由层级', required: false })
  @IsNumber({}, { message: '路由层级传值错误' })
  @Min(0)
  level: number

  @ApiProperty({ description: '菜单是否隐藏', required: false, default: false })
  @IsBoolean()
  @ValidateIf((o) => o.type !== 3)
  readonly hidden: boolean

  @ApiProperty({ description: '开启页面缓存', required: false, default: true })
  @IsBoolean()
  @ValidateIf((o) => o.type === 1)
  readonly keepalive: boolean = true

  @ApiProperty({ description: '外链打开方式', required: false, default: 1 })
  @IsIn([1, 2])
  @ValidateIf((o) => o.type !== 3)
  readonly openMode: number

  @ApiProperty({ description: '是否外链，开启外链条件，1、isLink: 链接地址不为空 2、isIframe:false', required: false })
  isLink: string

  @IsBoolean()
  @ApiProperty({ description: '是否内嵌窗口，开启条件，1、isIframe:true 2、isLink：链接地址不为空', required: false })
  isIframe: boolean
}
