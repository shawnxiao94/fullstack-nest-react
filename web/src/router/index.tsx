import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { RouteObject } from '@/router/interface'
import lazyLoad from '@/components/LazyLoad'
import BasicLayout from '@/layouts/BasicLayout'
import Login from '@/views/Login'

export const asyncRoute: RouteObject[] = [
  {
    element: <BasicLayout />,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/home',
        element: lazyLoad(React.lazy(() => import('@/views/Home'))),
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
    meta: {
      title: '数据大屏'
    },
    children: [
      {
        path: '/dataScreen/index',
        element: lazyLoad(React.lazy(() => import('@/views/DataScreen'))),
        meta: {
          requiresAuth: true,
          title: '数据大屏',
          key: 'dataScreen',
          icon: 'AreaChartOutlined'
        }
      }
    ]
  },
  {
    element: <BasicLayout />,
    meta: {
      title: '常用组件'
    },
    children: [
      {
        path: '/assembly/guide',
        element: lazyLoad(React.lazy(() => import('@/views/AssemblyGuide'))),
        meta: {
          requiresAuth: true,
          title: '引导页',
          key: 'guide'
        }
      }
    ]
  },
  {
    element: <BasicLayout />,
    meta: {
      requiresAuth: true,
      title: '数据图表',
      key: 'echarts'
    },
    children: [
      {
        path: '/echarts/waterChart',
        element: lazyLoad(React.lazy(() => import('@/views/Echarts/WaterChart'))),
        meta: {
          requiresAuth: true,
          title: '水型图',
          key: '/echarts/waterChart'
        }
      },
      {
        path: '/echarts/columnChart',
        element: lazyLoad(React.lazy(() => import('@/views/Echarts/ColumnChart'))),
        meta: {
          requiresAuth: true,
          title: '柱状图',
          key: '/echarts/columnChart'
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
      key: 'login'
    }
  },
  ...asyncRoute,
  {
    path: '/403',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/403'))),
    meta: {
      requiresAuth: true,
      title: '403页面',
      key: '403'
    }
  },
  {
    path: '/404',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/404'))),
    meta: {
      requiresAuth: false,
      title: '404页面',
      key: '404'
    }
  },
  {
    path: '/500',
    element: lazyLoad(React.lazy(() => import('@/components/ErrorMessage/500'))),
    meta: {
      requiresAuth: false,
      title: '500页面',
      key: '500'
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
