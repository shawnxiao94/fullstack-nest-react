import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, IsOptional, IsArray, IsNumber, IsNotEmpty } from 'class-validator'
export class CreateRoleDto {
  @ApiProperty({ description: '角色编号', required: true })
  @IsString({ message: 'code 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'code 不能为空' })
  @Length(2, 20, { message: 'code 字符长度在 2~20' })
  code: string

  @ApiProperty({ description: '角色名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(2, 20, { message: 'name 字符长度在 2~20' })
  name: string

  @ApiProperty({ description: '角色备注', required: false })
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @Length(0, 100, { message: 'remark 字符长度在 0~100' })
  @IsOptional()
  remark: string

  @ApiProperty({ description: '当前角色所拥有的菜单组', required: false })
  @IsArray({ message: 'menuIds 类型错误，正确类型 string[]' })
  // @IsString({ each: true, message: '菜单组内类型错误' })
  // @IsNotEmpty({ each: true, message: '菜单id 不能为空' })
  menuIds: string[]
}
