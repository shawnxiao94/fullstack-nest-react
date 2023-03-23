import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { RouteObject } from '@/router/interface'
import lazyLoad from '@/components/LazyLoad'
import BasicLayout from '@/layouts/BasicLayout'
import Login from '@/views/login'

export const asyncRoute: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/home',
        element: lazyLoad(React.lazy(() => import('@/views/home'))),
        meta: {
          requiresAuth: true,
          title: '首页',
          key: 'home',
          icon: 'HomeOutlined'
        }
      }
    ]
  },
  {
    path: '/dataScreen',
    meta: {
      title: '数据大屏'
    },
    children: [
      {
        path: '/dataScreen/index',
        element: lazyLoad(React.lazy(() => import('@/views/dataScreen'))),
        meta: {
          requiresAuth: true,
          title: '数据大屏',
          key: 'DataScreen',
          icon: 'AreaChartOutlined'
        }
      }
    ]
  },
  {
    path: '/assembly',
    element: <BasicLayout />,
    meta: {
      title: '常用组件'
    },
    children: [
      {
        path: '/assembly/Guide',
        element: lazyLoad(React.lazy(() => import('@/views/assemblyGuide'))),
        meta: {
          requiresAuth: true,
          title: '引导页',
          key: 'assemblyGuide'
        }
      }
    ]
  },
  {
    path: '/echarts',
    element: <BasicLayout />,
    meta: {
      requiresAuth: true,
      title: '数据图表',
      key: 'Echarts'
    },
    children: [
      {
        path: '/echarts/waterChart',
        element: lazyLoad(React.lazy(() => import('@/views/echarts/waterChart'))),
        meta: {
          requiresAuth: true,
          title: '水型图',
          key: 'echartsWaterChart'
        }
      },
      {
        path: '/echarts/columnChart',
        element: lazyLoad(React.lazy(() => import('@/views/echarts/columnChart'))),
        meta: {
          requiresAuth: true,
          title: '柱状图',
          key: 'echartsColumnChart'
        }
      }
    ]
  },
  {
    path: '/sysManage',
    element: <BasicLayout />,
    meta: {
      requiresAuth: true,
      icon: 'PieChartOutlined',
      title: '系统管理',
      key: 'sysManage'
    },
    children: [
      {
        path: '/sysManage/userManage',
        element: lazyLoad(React.lazy(() => import('@/views/sysManage/userManage'))),
        meta: {
          requiresAuth: true,
          icon: 'AppstoreOutlined',
          title: '用户管理',
          key: 'sysManageUserManage'
        }
      },
      {
        path: '/sysManage/roleManage',
        element: lazyLoad(React.lazy(() => import('@/views/sysManage/roleManage'))),
        meta: {
          requiresAuth: true,
          icon: 'AppstoreOutlined',
          title: '角色管理',
          key: 'sysManageRoleManage'
        }
      },
      {
        path: '/sysManage/menuManage',
        element: lazyLoad(React.lazy(() => import('@/views/sysManage/menuManage'))),
        meta: {
          requiresAuth: true,
          icon: 'AppstoreOutlined',
          title: '菜单管理',
          key: 'sysManageMenuManage'
        }
      }
    ]
  }
]

export const rootRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      requiresAuth: false,
      title: '登录页',
      key: 'Login'
    }
  },
  ...asyncRoute,
  {
    path: '/403',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/403'))),
    meta: {
      requiresAuth: true,
      title: '403页面',
      key: 'ErrorMessage403'
    }
  },
  {
    path: '/404',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/404'))),
    meta: {
      requiresAuth: false,
      title: '404页面',
      key: 'ErrorMessage404'
    }
  },
  {
    path: '/500',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/500'))),
    meta: {
      requiresAuth: false,
      title: '500页面',
      key: 'ErrorMessage500'
    }
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]

const Router = () => {
  const routes = useRoutes(rootRouter as any)
  return routes
}
export default Router
