export enum UserType {
  /** 超管 */
  SUPER_ADMIN = 0,
  /** 后台系统用户 */
  ADMIN_USER = 1,
  /** 普通用户 */
  ORDINARY_USER = 2
}

export enum Sex {
  man = 0,
  women = 1
}

export enum StatusValue {
  /** 禁用 */
  FORBIDDEN = 0,
  /** 正常使用 */
  NORMAL = 1
}

export enum MenuType {
  /** 菜单 */
  MENU = 0,
  /** tabs 页面菜单 */
  TAB = 1,
  /** 按钮 */
  BUTTON = 2
}
