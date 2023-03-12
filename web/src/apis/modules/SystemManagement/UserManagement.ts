import { SystemManagement } from '@/apis/interface/index'
// import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'

/**
 * @name 用户模块
 */
// * 用户列表接口
export const findUserListApi = (params: SystemManagement.ReqUserManageForm) => {
  return http.post<SystemManagement.ResUserManageList>('./mock/nestApi/admin/sys/user/list', params)
}
