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
import { ApiProperty } from '@nestjs/swagger'
import { Match } from 'src/common/decorator/match.decorator'
import { isEmpty } from 'lodash'

export class CreateUserDto {
  @ApiProperty({ required: false, description: '手机号' })
  // @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
  // @IsOptional()
  @IsString()
  mobile: string

  @ApiProperty({
    required: false,
    description: '用户邮箱'
  })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请输入密码' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请输入密码' })
  @IsString()
  @MinLength(6)
  @Match('password', { message: '两次密码不一致' })
  confirmPassword: string

  @ApiProperty({ description: '账户名' })
  @IsNotEmpty({ message: '请输入账户名' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  account: string

  @ApiProperty({
    description: '归属角色',
    required: false,
    type: [String]
  })
  @IsArray({ message: 'roleIds 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '角色组内类型错误' })
  @IsNotEmpty({ each: true, message: '角色id 不能为空' })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  roleIds: string[]

  @ApiProperty({
    description: '状态,1-有效，0-禁用',
    required: false,
    default: 1
  })
  @IsIn([0, 1])
  status: number

  @ApiProperty({
    description: '昵称',
    required: false
  })
  @IsString()
  nickName: string

  @ApiProperty({
    description: '头像url',
    required: false
  })
  @IsString()
  avatar: string

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

export class AddUserDto {
  @ApiProperty({ required: false, description: '手机号' })
  // @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
  // @IsOptional()
  @IsString()
  mobile: string

  @ApiProperty({
    required: false,
    description: '用户邮箱'
  })
  // @IsEmail()
  // @ValidateIf((o) => !isEmpty(o.email))
  @IsString()
  email: string

  @ApiProperty({ description: '账户名', required: true })
  @IsNotEmpty({ message: '请输入账户名' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  account: string

  @ApiProperty({
    description: '归属角色',
    required: false,
    type: [String]
  })
  @IsArray({ message: 'roleIds 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '角色组内类型错误' })
  roleIds: string[]

  @ApiProperty({
    description: '归属部门',
    required: false,
    type: String
  })
  @IsString({ message: '类型错误' })
  deptId: string

  @ApiProperty({
    description: '状态,1-有效，0-禁用',
    required: false,
    default: 1
  })
  @IsIn([0, 1])
  status: number

  @ApiProperty({
    description: '昵称',
    required: false
  })
  @IsString()
  nickName: string

  @ApiProperty({
    description: '头像url',
    required: false
  })
  @IsString()
  avatar: string

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
