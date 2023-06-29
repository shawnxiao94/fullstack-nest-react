import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/nestApi/admin/sys/menu/listPage',
    method: 'post',
    response: () => {
      return {
        code: 200,
        status: 'OK',
        data: {
          data: [
            {
              createTime: '2023-03-10T15:01:50.504Z',
              updateTime: '2023-03-10T15:07:10.616Z',
              id: '10522e38-5e92-405c-bacd-17fb700654ef',
              parentId: 'b31b3e36-4938-44b3-b589-dec116cc0857',
              type: 2,
              name: 'SystemManagementUserManagement',
              path: '/systemManagement/userManagement',
              componentPath: 'views/SystemManagement/UserManagement',
              title: '用户管理',
              icon: 'icon-home',
              redirect: '/systemManagement/userManagement',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 1
            },
            {
              createTime: '2023-03-10T15:03:58.016Z',
              updateTime: '2023-03-10T15:07:02.249Z',
              id: '3ee17b20-3d57-4dee-9076-b8273b8bf4c1',
              parentId: 'b31b3e36-4938-44b3-b589-dec116cc0857',
              type: 2,
              name: 'SystemManagementRoleManagement',
              path: '/systemManagement/roleManagement',
              componentPath: 'views/SystemManagement/RoleManagement',
              title: '角色管理',
              icon: 'icon-home',
              redirect: '/systemManagement/roleManagement',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 2
            },
            {
              createTime: '2023-03-10T15:04:46.174Z',
              updateTime: '2023-03-10T15:06:47.263Z',
              id: 'c1209357-2adb-43bd-a98f-7db2fe501b52',
              parentId: 'b31b3e36-4938-44b3-b589-dec116cc0857',
              type: 2,
              name: 'SystemManagementMenuManagement',
              path: '/systemManagement/menuManagement',
              componentPath: 'views/SystemManagement/MenuManagement',
              title: '菜单管理',
              icon: 'icon-home',
              redirect: '/systemManagement/menuManagement',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 2
            },
            {
              createTime: '2023-03-10T14:59:30.101Z',
              updateTime: '2023-03-10T15:02:22.091Z',
              id: 'b31b3e36-4938-44b3-b589-dec116cc0857',
              parentId: 'root',
              type: 1,
              name: 'SystemManagement',
              path: '/systemManagement',
              componentPath: 'views/SystemManagement',
              title: '系统管理',
              icon: 'icon-home',
              redirect: '/systemManagement/userManagement',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 1
            },
            {
              createTime: '2023-03-10T08:27:06.252Z',
              updateTime: '2023-03-10T14:45:24.096Z',
              id: 'ec41871c-41a4-48dd-bcce-1a8df7faf392',
              parentId: 'root',
              type: 1,
              name: 'Home',
              path: '/',
              componentPath: 'Layout',
              title: '首页',
              icon: 'icon-home',
              redirect: '/home',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 1
            },
            {
              createTime: '2023-03-10T08:28:29.247Z',
              updateTime: '2023-03-10T08:28:29.247Z',
              id: '0d246597-4973-402f-a9e6-700de27170d1',
              parentId: 'ec41871c-41a4-48dd-bcce-1a8df7faf392',
              type: 2,
              name: 'HomeIndex',
              path: '/home',
              componentPath: 'views/Home',
              title: '首页',
              icon: 'icon-home',
              redirect: '',
              isLink: '',
              isIframe: false,
              hidden: false,
              keepalive: false,
              level: 0,
              sort: 0,
              openMode: 1
            }
          ],
          total: 6,
          pageSize: 10,
          current: 1
        }
      }
    }
  }
] as MockMethod[]