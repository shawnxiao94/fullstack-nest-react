import { Controller, Get, Query, Post, Body, Req, Headers, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
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
import { Authorize } from '../core/decorators/authorize.decorator'
import { IpAddress } from '@/common/decorator/client-info.decorator'

@ApiTags('登录模块')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService, private utilService: UtilService) {}

  @ApiOperation({
    summary: '获取登录图片验证码'
  })
  @ApiOkResponse({ type: ImageCaptcha })
  @Get('captcha/img')
  @Authorize()
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto)
  }

  @ApiOperation({
    summary: '管理员登录'
  })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  // @LogDisabled()
  @Authorize()
  async login(@Body() dto: LoginInfoDto, @IpAddress() clientIp: string, @Req() req: Request, @Headers('user-agent') ua: string): Promise<ResultData> {
    const ip = this.utilService.getReqIP(req)
    console.log('ip:', ip, clientIp, req.headers['user-agent'])
    return await this.loginService.loginSign(dto, ip || clientIp, ua)
  }
}
