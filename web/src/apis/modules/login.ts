import { Login } from '@/apis/interface/index'
import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(basePath + '/admin/auth/login', params)
  // return http.post<Login.ResLogin>(basePath + '/login', {}, { params }) // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(basePath + '/login', qs.stringify(params)) // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
  // return http.post<Login.ResLogin>(basePath + '/login', params, { headers: { noLoading: true } }) // 控制当前请求不显示 loading
}

// * 获取验证码
export const getCaptchaApi = params => {
  return http.get<Login.ResAuthButtons>(`${basePath}/admin/auth/captcha/img?width=${params.width}&height=${params.height}`)
}
// * 获取公钥
export const getPublicKeyApi = () => {
  return http.get<Login.ResPublicKey>(basePath + '/admin/auth/publicKey')
}
// * 获取按钮权限
export const getAuthorButtons = () => {
  return http.get<Login.ResAuthButtons>(basePath + '/auth/buttons')
}

// * 获取菜单列表
export const getMenuList = params => {
  return http.post<Menu.MenuOptions[]>(basePath + '/admin/sys/role/infosByIds', params)
}
