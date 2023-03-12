import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/nestApi/admin/sys/user/list',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '成功',
        data: {
          data: {
            data: [
              {
                createTime: '2023-03-10T08:05:14.129Z',
                id: 'b31e76fd-d8a0-4669-bab7-f80d6e173264',
                name: null,
                account: 'superAdmin',
                nickName: 'admin',
                avatar: '',
                email: '',
                mobile: '',
                remark: '',
                sex: 1,
                type: 0,
                status: 1,
                address: null,
                openid: null,
                roles: [],
                dept: null
              },
              {
                createTime: '2023-03-10T08:04:56.995Z',
                id: '851e3bad-ce4c-4506-876a-ebce7d36e97e',
                name: null,
                account: 'hongyeqingfeng',
                nickName: 'hongye',
                avatar: '',
                email: '',
                mobile: '',
                remark: '',
                sex: 1,
                type: 0,
                status: 1,
                address: null,
                openid: null,
                roles: [],
                dept: null
              },
              {
                createTime: '2023-03-10T08:04:43.911Z',
                id: '16b69364-f92a-4dd8-9607-9f1cea015ada',
                name: null,
                account: 'shawnxiao',
                nickName: 'shawn',
                avatar: '',
                email: '',
                mobile: '',
                remark: '',
                sex: 1,
                type: 0,
                status: 1,
                address: null,
                openid: null,
                roles: [],
                dept: null
              }
            ],
            total: 3
          }
        }
      }
    }
  }
] as MockMethod[]
