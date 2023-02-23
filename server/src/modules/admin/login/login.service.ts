import { Injectable } from '@nestjs/common'
import * as svgCaptcha from 'svg-captcha'
import { UtilService } from '@/common/utils/utils.service'
import { CreateLoginDto } from './dto/create-login.dto'
import { UpdateLoginDto } from './dto/update-login.dto'
import { ImageCaptcha } from './dto/login.class'
import { LoginInfoDto, ImageCaptchaDto } from './dto/login.dto'

import { RedisService } from '@/common/libs/redis/redis.service'
import { UserService } from '../system/user/user.service'
import { RoleService } from '../system/role/role.service'

import { ResultData } from '@/common/utils/result'
import { AppHttpCode } from '@/common/enums/code.enum'
import { compareSync, hashSync } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'

@Injectable()
export class LoginService {
  constructor(
    // private readonly configService: ConfigService,
    private jwtService: JwtService,
    private roleService: RoleService,
    private userService: UserService,
    private redisService: RedisService,
    private utilService: UtilService
  ) {}
  /**s
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: this.utilService.isEmpty(captcha.width) ? 100 : captcha.width,
      height: this.utilService.isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890'
    })
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: this.utilService.generateUUID()
    }
    // 5分钟过期时间
    await this.redisService.set(`admin:captcha:img:${result.id}`, svg.text, 60 * 5)
    return result
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<boolean> {
    let flag = false
    const result = await this.redisService.get(`admin:captcha:img:${id}`)
    if (this.utilService.isEmpty(result) || String(code).toLowerCase() !== String(result).toLowerCase()) {
    } else {
      // 校验成功后移除验证码
      await this.redisService.del(`admin:captcha:img:${id}`)
      flag = true
    }
    return flag
  }

  createToken(user) {
    return this.jwtService.sign(user)
  }

  /**
   * 登录获取JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async loginSign({ account, password, mobile, email, captchaId, verifyCode }: LoginInfoDto, ip: string, ua: string): Promise<ResultData> {
    if (!(mobile || email || account)) {
      return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '账号/手机号/邮箱必须有一个值不空！')
    }
    if (!(await this.checkImgCaptcha(captchaId, verifyCode))) {
      return await ResultData.fail(AppHttpCode.CAPTCHA_NOT_INVALID, '验证码不正确!')
    }
    const user = await this.userService.findInfoByAccountOrMobileOrEmail({ account, email, mobile })
    if (!user) {
      return await ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '查询失败，请核对账号/手机/邮箱!')
    }

    if (!compareSync(password, user.password)) {
      return await ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '密码不正确。')
    }
    const roleIds = user.roles.map((role) => role.id)
    const res = await this.roleService.findInfosByIds({ ids: roleIds, requireMenus: true, treeType: true })
    let menus = []
    if (res.data.length) {
      menus = res.data.reduce((pre, cur) => pre.concat(cur.menus), [])
    }
    const token = this.createToken({
      id: String(user.id),
      pv: 1
    })
    await this.redisService.set(`admin:passwordVersion:${user.id}`, '1')
    // Token设置过期时间 24小时
    await this.redisService.set(`admin:token:${user.id}`, token, 60 * 60 * 24)
    await this.redisService.set(`admin:menus:${user.id}`, JSON.stringify(menus))
    // await this.logService.saveLoginLog(user.id, ip, ua)
    return await ResultData.ok({ token })
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: string): Promise<void> {
    await this.userService.forbidden(uid)
  }

  async getRedisPasswordVersionById(id: string): Promise<string> {
    return await this.redisService.get(`admin:passwordVersion:${id}`)
  }

  async getRedisTokenById(id: string): Promise<string> {
    return await this.redisService.get(`admin:token:${id}`)
  }

  async getRedisPermsById(id: string): Promise<string> {
    return await this.redisService.get(`admin:menus:${id}`)
  }
}
