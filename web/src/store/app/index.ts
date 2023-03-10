import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeConfig = {
  primary: string
  isDark: boolean
  weakOrGray: string
  breadcrumb: boolean
  tabs: boolean
  footer: boolean
}
type UserInfo = {
  name: string
}
type State = {
  userInfo: UserInfo
  token: string
  authRouter: string[]
  assemblySize: string
  isCollapse: boolean
  language: string
  themeConfig: ThemeConfig
  breadcrumbList: string[]
  menuList: string[]
  tabsList: string[]
  authButtons: any[]
}
const initialState: State = {
  userInfo: {
    name: ''
  },
  token: '',
  authRouter: [],
  isCollapse: false, // 菜单收缩状态
  assemblySize: 'middle',
  language: '',
  breadcrumbList: [], // 面包屑导航列表
  menuList: [], // 菜单列表
  tabsList: [], // tab列表
  authButtons: [], // 按钮权限列表
  themeConfig: {
    // 默认 primary 主题颜色
    primary: '#1890ff',
    // 深色模式
    isDark: false,
    // 色弱模式(weak) || 灰色模式(gray)
    weakOrGray: '',
    // 面包屑导航
    breadcrumb: false,
    // 标签页
    tabs: true,
    // 页脚
    footer: false
  }
}
// 固定格式，创建 slice 对象
const appSlice = createSlice({
  name: 'app',
  initialState,
  // 相当于原来reducer中的case
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    setAuthRouter(state, action: PayloadAction<string[]>) {
      state.authRouter = action.payload
    },
    updateCollapse(state, action: PayloadAction<boolean>) {
      state.isCollapse = action.payload
    },
    updateAssemblySize(state, action: PayloadAction<string>) {
      state.assemblySize = action.payload
    },
    setThemeConfig(state, action: PayloadAction<ThemeConfig>) {
      state.themeConfig = action.payload
    },
    setBreadcrumbList(state, action: PayloadAction<string[]>) {
      state.breadcrumbList = action.payload
    },
    setMenuList(state, action: PayloadAction<string[]>) {
      state.menuList = action.payload
    },
    setTabsList(state, action: PayloadAction<string[]>) {
      state.tabsList = action.payload
    }
  }
})

// 官方推荐使用 ES6 解构和导出语法
// 提取action creator 对象与reducer函数
const { reducer, actions } = appSlice
// 提取并导出根据reducers命名的 action creator 函数
export const {
  setUserInfo,
  setToken,
  setLanguage,
  setAuthRouter,
  setMenuList,
  setBreadcrumbList,
  updateCollapse,
  updateAssemblySize,
  setThemeConfig,
  setTabsList
} = actions
// 导出 reducer 函数
export default reducer
