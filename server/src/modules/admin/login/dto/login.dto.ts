import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, IsMobilePhone, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class LoginInfoDto {
  @ApiProperty({ description: '管理员账户名' })
  @IsString()
  @MinLength(1)
  account: string

  @ApiProperty({ required: false, description: '手机号' })
  // @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
  @IsString()
  mobile: string

  @ApiProperty({ description: '邮箱', required: false })
  @IsString()
  email: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请输入密码' })
  @IsString()
  password: string

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string

  @ApiProperty({ description: '用户输入的验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string
}

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: '验证码宽度'
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly width: number = 100

  @ApiProperty({
    required: false,
    default: 50,
    description: '验证码高度'
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly height: number = 50
}
