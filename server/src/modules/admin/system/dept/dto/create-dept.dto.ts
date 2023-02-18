import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator'

export class CreateDeptDto {
  @ApiProperty({ required: true, description: '上级部门 id', default: 'root' })
  @IsString({ message: 'parentId 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'parentId 不能为空' })
  readonly parentId: string

  @ApiProperty({ description: '部门名称', required: true })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'name 不能为空' })
  readonly name: string

  @ApiProperty({ description: '部门编号', required: true })
  @IsString({ message: 'code 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'code 不能为空' })
  readonly code: string

  @ApiProperty({ required: false, description: '部门负责人id' })
  @IsString({ message: 'leader 类型错误，正确类型 string' })
  readonly userId: string

  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark  类型错误，正确类型 string' })
  @IsOptional()
  remark?: string

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: 'orderNum 类型错误， 正确类型 number ' })
  @Min(0)
  readonly orderNum: number
}
