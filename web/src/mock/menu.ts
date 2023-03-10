import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/nestApi/admin/sys/role/infosByIds',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: {
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
              path: '/assembly/guide',
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
            }
          ]
        }
      }
    }
  }
] as MockMethod[]
