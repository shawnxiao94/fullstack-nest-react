import React, { useEffect, useState } from 'react'
import { Menu, Spin } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import type { MenuProps } from 'antd'
import * as Icons from '@ant-design/icons'
import { setAuthRouter, setBreadcrumbList, setMenuList } from '@/store/app'
import Logo from './components/Logo'
import { useRoleManageApi } from '@/apis/modules/sysManage'
import { findAllBreadcrumb, getOpenKeys, handleRouter, searchRoute } from '@/utils'
import './index.less'

// 定义 menu 类型
type MenuItem = Required<MenuProps>['items'][number]

const roleApi = useRoleManageApi()

const LayoutMenu = (props: any) => {
  const { pathname } = useLocation()
  const { isCollapse, userInfo, setBreadcrumbList, setAuthRouter, setMenuList: setMenuListAction } = props
  console.log(findAllBreadcrumb, setBreadcrumbList)
  // 获取菜单列表并处理成 antd menu 需要的格式
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 刷新页面菜单保持高亮
  useEffect(() => {
    setSelectedKeys([pathname])
    isCollapse ? null : setOpenKeys(getOpenKeys(pathname))
  }, [pathname, isCollapse])

  // 设置当前展开的 subMenu
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys)
    const latestOpenKey = openKeys[openKeys.length - 1]
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys)
    setOpenKeys([latestOpenKey])
  }

  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem
  }

  // 动态渲染 Icon 图标
  const customIcons: { [key: string]: any } = Icons
  const addIcon = (name: string) => {
    let n = <></>
    try {
      n = React.createElement(customIcons[name])
    } catch (err) {
      console.log(err)
    }
    return n
  }
  // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
  const deepLoopFloat = (menuList: Menu.MenuOptions[]) => {
    const newArr: MenuItem[] = []
    menuList.forEach((item: Menu.MenuOptions) => {
      // 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
      if (!item?.children?.length) return newArr.push(getItem(item.title, item.path, addIcon(item.icon!)))
      newArr.push(getItem(item.title, item.path, addIcon(item.icon!), deepLoopFloat(item.children)))
    })
    return newArr
  }

  const getMenuData = async () => {
    setLoading(true)
    try {
      const res: any = await roleApi.findMenuPermsByRoleIdsApi({
        ids: userInfo?.roles?.length ? userInfo.roles.map(r => r.id) : [],
        requireMenus: true,
        treeType: true
      })
      if (!res?.treeArr?.length) return
      setMenuList(deepLoopFloat(res.treeArr))
      // 存储处理过后的所有面包屑导航栏到 redux 中
      setBreadcrumbList(findAllBreadcrumb(res.treeArr))
      // 把路由菜单处理成一维数组，存储到 redux 中，做菜单权限判断
      const dynamicRouter = handleRouter(res.treeArr)
      setAuthRouter(dynamicRouter)
      setMenuListAction(res.treeArr)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getMenuData()
  }, [])

  // 点击当前菜单跳转页面
  const navigate = useNavigate()
  const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
    const route = searchRoute(key, props.menuList)
    if (route.isLink) window.open(route.isLink, '_blank')
    navigate(key)
  }

  return (
    <div className="menu">
      <Spin spinning={loading} tip="Loading...">
        <Logo></Logo>
        <Menu
          theme="dark"
          mode="inline"
          triggerSubMenuAction="click"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onClick={clickMenu}
          onOpenChange={onOpenChange}></Menu>
      </Spin>
    </div>
  )
}

const mapStateToProps = (state: any) => state.app
const mapDispatchToProps = { setMenuList, setBreadcrumbList, setAuthRouter }
export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu)
