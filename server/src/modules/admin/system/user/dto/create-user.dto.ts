import { IsString, IsNotEmpty, IsMobilePhone, IsOptional, IsIn, MinLength, Matches, MaxLength, IsEmail, ValidateIf, IsInt, Min, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Match } from 'src/common/decorator/match.decorator'
import { isEmpty } from 'lodash'

export class CreateUserDto {
  @ApiProperty({ required: false, description: '手机号' })
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
  @IsOptional()
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

  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  username: string

  // @ApiProperty({
  //   description: '归属角色',
  //   type: [Number]
  // })
  // @ArrayNotEmpty()
  // @ArrayMinSize(1)
  // @ArrayMaxSize(3)
  // roles: number[]

  // @ApiProperty({
  //   description: '状态'
  // })
  // @IsIn([0, 1])
  // status: number
}
