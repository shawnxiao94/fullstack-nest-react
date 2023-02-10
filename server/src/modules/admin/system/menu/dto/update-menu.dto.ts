import { PartialType } from '@nestjs/swagger'

import { ApiProperty } from '@nestjs/swagger'
import { ResultData } from '@/common/utils/result'
import { CreateMenuDto } from './create-menu.dto'

import { IsNumber, IsNotEmpty, IsString, Length, IsIn, Min, IsArray, IsOptional, IsNumberString } from 'class-validator'
import { $enum } from 'ts-enum-util'

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ description: '菜单id', required: true })
  @IsNumberString({}, { message: 'id 类型错误' })
  @IsNotEmpty()
  id: string
}

export class IdNameDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '菜单id', required: true })
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '菜单name', required: true })
  name: string
}
