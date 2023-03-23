// * 请求响应参数(不包含data)
export interface Result {
  code: string
  msg: string
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data?: T
}

// * 分页响应参数
export interface ResPage<T> {
  datalist: T[]
  pageNum: number
  pageSize: number
  total: number
}

// * 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}

// * 登录
export namespace Login {
  export interface ReqLoginForm {
    account: string
    password: string
    verifyCode: string
    captchaId: string
    hashClient: string
    ivClient: string
    remember?: boolean
  }
  export interface ResPublicKey {
    key: string
  }
  export interface ResLogin {
    encryptUserInfo: string
    token: string
    userInfo: string
    signature: string
  }
  export interface ResAuthButtons {
    [propName: string]: any
  }
}
// * 系统管理
export namespace SysManage {
  export interface ReqUserManageForm {
    pageSize: number
    pageNumber: number
    keywords: string
    status: number
    roleIds: string[]
    deptId: string
  }
  export interface ReqUserManageUserInfo {
    id: string
    status?: number
    roleIds?: string[]
    deptId?: string
    nickName?: string
    remark?: string
    sex?: string
  }
  export interface ReqRoleManagementForm {
    pageSize: number
    pageNumber: number
    keywords: string
    orderBy?: string
  }
  export interface ReqMenuManagementForm {
    pageSize: number
    pageNumber: number
    keywords: string
  }
  export interface ReqUpdateMenu {
    type: number
    parentId: string
    name: string
    path: string
    componentPath: string
    redirect: string
    title: string
    icon: string
    sort: number
    level: number
    hidden: boolean
    keepalive: boolean
    openMode: number
    isLink: boolean
    isIframe: boolean
    id: string
  }
}
