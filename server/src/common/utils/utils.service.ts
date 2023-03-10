import { Injectable } from '@nestjs/common'
import { customAlphabet, nanoid } from 'nanoid'
// import * as CryptoJS from 'crypto-js'

@Injectable()
export class UtilService {
  /**
   * 获取请求IP
   */
  getReqIP(req: any): string {
    return (
      // 判断是否有反向代理 IP
      (
        (req.headers['x-forwarded-for'] as string) ||
        // 判断后端的 socket 的 IP
        req.socket.remoteAddress
      ).replace('::ffff:', '')
    )
  }

  // /**
  //  * AES加密
  //  */
  // public aesEncrypt(msg: string, secret: string): string {
  //   return CryptoJS.AES.encrypt(msg, secret).toString()
  // }

  // /**
  //  * AES解密
  //  */
  // public aesDecrypt(encrypted: string, secret: string): string {
  //   return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
  // }

  // /**
  //  * md5加密
  //  */
  // public md5(msg: string): string {
  //   return CryptoJS.MD5(msg).toString()
  // }

  /* 判断IP是不是内网 */
  IsLAN(ip: string) {
    ip.toLowerCase()
    if (ip == 'localhost') return true
    let a_ip = 0
    if (ip == '') return false
    const aNum = ip.split('.')
    if (aNum.length != 4) return false
    a_ip += parseInt(aNum[0]) << 24
    a_ip += parseInt(aNum[1]) << 16
    a_ip += parseInt(aNum[2]) << 8
    a_ip += parseInt(aNum[3]) << 0
    a_ip = (a_ip >> 16) & 0xffff
    return (
      a_ip >> 8 == 0x7f || a_ip >> 8 == 0xa || a_ip == 0xc0a8 || (a_ip >= 0xac10 && a_ip <= 0xac1f)
    )
  }

  /**
   * 生成一个UUID
   */
  public generateUUID(): string {
    return nanoid()
  }

  /**
   * 生成一个随机的值
   */
  public generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  ): string {
    const customNanoid = customAlphabet(placeholder, length)
    return customNanoid()
  }

  public isEmpty(value) {
    return value === undefined && value === '' && value === null
  }
}
