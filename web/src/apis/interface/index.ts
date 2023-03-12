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
    verifyCode: number
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
export namespace SystemManagement {
  export interface ReqUserManageForm {
    pageSize: number
    pageNumber: number
    keywords: string
    status: number
    roleIds: string[]
    deptId: string
  }
  export interface ResUserManageList {
    data: any[]
  }
  export interface ReqRoleManagementForm {
    pageSize: number
    pageNumber: number
    keywords: string
    orderBy?: string
  }
  export interface ResRoleManagementList {
    data: any[]
  }
  export interface ReqMenuManagementForm {
    pageSize: number
    pageNumber: number
    keywords: string
  }
  export interface ResMenuManagementList {
    data: any[]
  }
}
