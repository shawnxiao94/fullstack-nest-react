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

import { getPublicKey, getPrivateKey } from '@/common/utils/rsa'
import { decrypt, createSignature, encryptCryptoJs } from '@/common/utils/crypto'

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
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ResultData> {
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
    // 60分钟过期时间
    await this.redisService.set(`admin:captcha:img:${result.id}`, svg.text, 60 * 60)
    return await ResultData.ok(result)
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<boolean> {
    let flag = false
    const result = await this.redisService.get(`admin:captcha:img:${id}`)
    if (
      this.utilService.isEmpty(result) ||
      String(code).toLowerCase() !== String(result).toLowerCase()
    ) {
      flag = false
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
  async loginSign(
    { account, password, captchaId, verifyCode, hashClient, ivClient }: LoginInfoDto,
    ip: string,
    ua: string
  ): Promise<ResultData> {
    // 解密成原账户
    const originalAccount = await (async () => {
      try {
        const key = await getPrivateKey()
        return await decrypt(account, key)
      } catch (e) {
        return account
      }
    })()
    if (!originalAccount) {
      return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '账号/手机号/邮箱必须有一个值不空！')
    }
    if (!(await this.checkImgCaptcha(captchaId, verifyCode))) {
      return await ResultData.fail(AppHttpCode.CAPTCHA_NOT_INVALID, '验证码不正确!')
    }
    const user = await this.userService.findInfoByAccountOrMobileOrEmail({
      account: originalAccount
    })
    if (!user) {
      return await ResultData.fail(
        AppHttpCode.USER_CREATE_EXISTING,
        '查询失败，请核对账号/手机/邮箱!'
      )
    }
    // 解密成原密码
    const originalPass = await (async () => {
      try {
        const key = await getPrivateKey()
        return await decrypt(password, key)
      } catch (e) {
        return password
      }
    })()
    // 解密成原客户端加密密钥
    const originalHashClient = await (async () => {
      try {
        const key = await getPrivateKey()
        return await decrypt(hashClient, key)
      } catch (e) {
        return hashClient
      }
    })()
    const originIv = await (async () => {
      try {
        const key = await getPrivateKey()
        return await decrypt(ivClient, key)
      } catch (e) {
        return ivClient
      }
    })()
    if (!compareSync(originalPass, user.password)) {
      return await ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '密码不正确。')
    }
    const roleIds = user.roles.map((role) => role.id)
    const res = await this.roleService.findMenusByIds({
      ids: roleIds
    })
    let menus = []
    if (res?.data?.length) {
      // 把菜单path路径作为唯一标识
      menus = res.data
    }
    const token = this.createToken({
      id: String(user.id),
      pv: 1
    })
    const privateKey = await getPrivateKey()
    /*
     * 前端传输到后端：公钥给前端加密，私钥解密，前端生成密钥通过公钥加密也传递给后端
     * 后端传输到前端：私钥解密出前端密钥A，通过A加密数据进行传输，前端通过密钥A解密数据，其中额外加了层验签
     */
    const objUsr = JSON.parse(JSON.stringify(user))
    delete objUsr.password
    delete objUsr.slat
    const encryptUserInfo = encryptCryptoJs(JSON.stringify(objUsr), originalHashClient)
    const signature = createSignature(encryptUserInfo, privateKey)
    await this.redisService.set(`admin:passwordVersion:${user.id}`, '1')
    // Token设置过期时间 24小时
    await this.redisService.set(`admin:token:${user.id}`, token, 60 * 60 * 24)
    // 存储菜单path路径作为唯一权限标识
    await this.redisService.set(`admin:menus:${user.id}`, JSON.stringify(menus))
    /**
     * 如果有资源权限可以继续再次存入redis
     */
    // await this.logService.saveLoginLog(user.id, ip, ua)
    return await ResultData.ok({
      token,
      encryptUserInfo,
      signature
    })
  }

  // 公钥
  async getPublicKeyApi(): Promise<ResultData> {
    const key = await getPublicKey()
    return await ResultData.ok(key)
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

  async getRedisMenusById(id: string): Promise<string> {
    return await this.redisService.get(`admin:menus:${id}`)
  }
  async getRedisPermsById(id: string): Promise<string> {
    return await this.redisService.get(`admin:perms:${id}`)
  }
}
