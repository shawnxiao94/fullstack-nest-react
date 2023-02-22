import { Controller, Get, Query, Post, Body, Req, Headers, Delete } from '@nestjs/common'
import { LoginService } from './login.service'
import { CreateLoginDto } from './dto/create-login.dto'
import { UpdateLoginDto } from './dto/update-login.dto'
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

import { Request } from 'express'

import { LoginInfoDto, ImageCaptchaDto } from './dto/login.dto'
import { ImageCaptcha, LoginToken } from './dto/login.class'

import { UtilService } from '@/common/utils/utils.service'

@ApiTags('登录模块')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private utilService: UtilService) {}

  @ApiOperation({
    summary: '获取登录图片验证码'
  })
  @ApiOkResponse({ type: ImageCaptcha })
  @Get('captcha/img')
  // @Authorize()
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto)
  }

  @ApiOperation({
    summary: '管理员登录'
  })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  // @LogDisabled()
  // @Authorize()
  async login(@Body() dto: LoginInfoDto, @Req() req: Request, @Headers('user-agent') ua: string): Promise<ResultData> {
    return await this.loginService.loginSign(dto, this.utilService.getReqIP(req), ua)
  }
}
