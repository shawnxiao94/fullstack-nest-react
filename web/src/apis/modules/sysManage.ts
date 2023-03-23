import { basePath } from '@/apis/config/servicePath'
// import qs from 'qs'

import http from '@/apis/request'

import { ResultData, SysManage } from '@/apis/interface'

/**
 * @name 用户模块
 */
export function useUserManageApi() {
  return {
    // * add user接口
    addUserApi: (params: {
      mobile: string
      email: string
      account: string
      roleIds: string[]
      deptId: string
      status: number
      nickName: string
      avatar: string
      remark: string
      sex: number
    }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/user/add`, params)
    },
    // * 用户列表接口
    findUserListApi: (params: SysManage.ReqUserManageForm) => {
      return http.post<ResultData>(`${basePath}/admin/sys/user/list`, params)
    },
    // * 更新用户接口
    updateUserInfoApi: (params: SysManage.ReqUserManageUserInfo) => {
      return http.post<ResultData>(`${basePath}/admin/sys/user/update`, params)
    },
    // * del用户接口
    delUserApi: (params: { id: string }) => {
      return http.delete<ResultData>(`${basePath}/admin/sys/user`, params)
    }
  }
}

/**
 * @name 菜单模块
 */
export function useMenuManageApi() {
  return {
    // * add菜单接口
    addMenuApi: (params: {
      parentId: string
      type: number
      name?: string
      path: string
      title: string
      componentPath?: string
      icon?: string
      sort: number
      level: number
      redirect?: string
      hidden?: boolean
      isLink?: string
      isIframe?: boolean
      openMode?: number
    }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/menu/add`, params)
    },
    // * 菜单列表接口
    findMenuListApi: (params: { keywords: string; orderBy?: string }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/menu/listPage`, params)
    },
    // * 菜单树接口
    findMenuTreeApi: (params: { parentId: string }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/menu/getMenuTree`, params)
    },
    // * 更新菜单接口
    updateMenuApi: (params: SysManage.ReqUpdateMenu) => {
      return http.put<ResultData>(`${basePath}/admin/sys/menu/update`, params)
    },
    // * del接口
    delMenuApi: (params: { id: string }) => {
      return http.delete<ResultData>(`${basePath}/admin/sys/menu/${params.id}`, params)
    }
  }
}
/**
 * @name 角色模块
 */
export function useRoleManageApi() {
  return {
    // * add角色
    addRoleApi: (params: { name: string; code: string; remark?: string; menuIds?: string[] }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/role/add`, params)
    },
    // * 角色列表分页接口
    findRoleListByPageApi: (params: { pageSize: number; pageNumber: number; keywords: string; orderBy?: string }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/role/listPage`, params)
    },
    // * 角色列表接口
    findRoleListApi: (params: { keywords: string; orderBy?: string }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/role/list`, params)
    },
    // * 角色id数组获取关联菜单接口
    findMenuPermsByRoleIdsApi: (params: { ids: string[]; requireMenus?: boolean; treeType?: boolean }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/role/menuPermsInfoByIds`, params)
    },
    // * 角色id获取信息及关联菜单接口
    findInfoMenusByRoleIdApi: (params: { id: string; requireMenus?: boolean; treeType?: boolean }) => {
      return http.post<ResultData>(`${basePath}/admin/sys/role/infoMenuById`, params)
    },
    // * 编辑角色接口
    updateRolesByIdApi: (params: { id: string; name?: string; remark?: string; menuIds?: string[] }) => {
      return http.put<ResultData>(`${basePath}/admin/sys/role/update`, params)
    },
    // * del接口
    delRoleApi: (params: { id: string }) => {
      return http.delete<ResultData>(`${basePath}/admin/sys/role`, params)
    }
  }
}
