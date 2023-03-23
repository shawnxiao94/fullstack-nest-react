import { Login } from '@/apis/interface/index'
import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'
import { ResultData } from '@/apis/interface'

/**
 * @name 登录模块
 */

export default function useLoginApi() {
  return {
    // * 用户登录接口
    loginApi: (params: Login.ReqLoginForm) => {
      return http.post<Login.ResLogin>(basePath + '/admin/auth/login', params)
      // return http.post<Login.ResLogin>(basePath + '/login', {}, { params }) // post 请求携带 query 参数  ==>  ?username=admin&password=123456
      // return http.post<Login.ResLogin>(basePath + '/login', qs.stringify(params)) // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
      // return http.post<Login.ResLogin>(basePath + '/login', params, { headers: { noLoading: true } }) // 控制当前请求不显示 loading
    },
    // * 获取验证码
    getCaptchaApi: (params: { width: number; height: number }) => {
      return http.get<Login.ResAuthButtons>(`${basePath}/admin/auth/captcha/img`, params)
    },
    // * 获取公钥
    getPublicKeyApi: () => {
      return http.get<Login.ResPublicKey>(basePath + '/admin/auth/publicKey')
    },
    // * 获取按钮权限
    getAuthorButtons: () => {
      return http.get<Login.ResAuthButtons>(basePath + '/auth/buttons')
    },
    // * 获取菜单列表
    getMenuList: (params: any) => {
      return http.post<ResultData>('./mock/nestApi/admin/sys/role/infosByIds', params)
    }
  }
}
