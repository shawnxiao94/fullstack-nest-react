import { SystemManagement } from '@/apis/interface/index'
// import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'

/**
 * @name 菜单模块
 */
// * 菜单列表接口
export const findMenuListApi = (params: SystemManagement.ReqMenuManagementForm) => {
  return http.post<SystemManagement.ResMenuManagementList>('./mock/nestApi/admin/sys/menu/listPage', params)
}
