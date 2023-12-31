import {
  IsString,
  IsNotEmpty,
  IsMobilePhone,
  IsOptional,
  IsIn,
  IsArray,
  MinLength,
  Matches,
  MaxLength,
  IsEmail,
  ValidateIf,
  IsInt,
  Min,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { isEmpty } from 'lodash'
import { Match } from 'src/common/decorator/match.decorator'

export class UpdateUserDto {
  @ApiProperty({
    description: '用户id',
    required: true,
    type: String
  })
  @IsNotEmpty({ message: '用户id 不能为空' })
  @IsString({ message: '类型错误' })
  id: string

  @ApiProperty({
    description: '归属角色',
    required: false,
    type: [String]
  })
  @IsArray({ message: 'roleIds 类型错误，正确类型 string[]' })
  roleIds: string[]

  @ApiProperty({
    description: '归属部门',
    required: false,
    type: String
  })
  deptId: string

  @ApiProperty({
    description: '状态,1-有效，0-禁用',
    required: false,
    default: 1
  })
  @IsIn([0, 1])
  status: number

  @ApiProperty({
    description: '真实姓名',
    required: false
  })
  @IsString()
  name: string

  @ApiProperty({
    description: '昵称',
    required: false
  })
  @IsString()
  nickName: string

  @ApiProperty({
    description: '备注',
    required: false
  })
  @IsString()
  remark: string

  @ApiProperty({
    description: '性别,0：女，1:男',
    required: false,
    default: 1
  })
  @IsIn([0, 1])
  sex: number
}

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: '用户ID',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: '缺少用户id' })
  @Type(() => String)
  id: string

  @ApiProperty({ description: '旧密码' })
  @IsNotEmpty({ message: '请输入旧密码' })
  @IsString()
  @MinLength(6)
  oldPassword: string

  @ApiProperty({ description: '新密码' })
  @IsNotEmpty({ message: '请输入新密码' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ description: '新密码' })
  @IsNotEmpty({ message: '请再次输入新密码' })
  @IsString()
  @MinLength(6)
  @Match('password', { message: '两次密码不一致' })
  confirmPassword: string
}
