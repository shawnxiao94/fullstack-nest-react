import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/nestApi/admin/sys/role/infosByIds',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: {
          data: {
            code: 200,
            menuList: [
              {
                icon: 'HomeOutlined',
                title: '首页',
                path: '/home'
              },
              {
                icon: 'AreaChartOutlined',
                path: '/dataScreen/index',
                title: '数据大屏'
              },
              {
                icon: 'AreaChartOutlined',
                path: '/assemblyGuide',
                title: '引导页'
              },
              {
                icon: 'PieChartOutlined',
                path: '/echarts',
                title: 'Echarts',
                children: [
                  {
                    icon: 'AppstoreOutlined',
                    path: '/echarts/waterChart',
                    title: '水型图'
                  }
                ]
              },
              {
                icon: 'PieChartOutlined',
                path: '/systemManagement',
                title: '系统管理',
                children: [
                  {
                    icon: 'AppstoreOutlined',
                    path: '/systemManagement/userManagement',
                    title: '用户管理'
                  },
                  {
                    icon: 'AppstoreOutlined',
                    path: '/systemManagement/roleManagement',
                    title: '角色管理'
                  },
                  {
                    icon: 'AppstoreOutlined',
                    path: '/systemManagement/menuManagement',
                    title: '菜单管理'
                  }
                ]
              }
            ]
          }
        }
      }
    }
  }
] as MockMethod[]
