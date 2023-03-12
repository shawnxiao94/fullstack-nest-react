import { SystemManagement } from '@/apis/interface/index'
// import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'

/**
 * @name 角色模块
 */
// * 角色列表接口
export const findRoleListApi = (params: SystemManagement.ReqRoleManagementForm) => {
  return http.post<SystemManagement.ResRoleManagementList>('./mock/nestApi/admin/sys/role/listPage', params)
}
