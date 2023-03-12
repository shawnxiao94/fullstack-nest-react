import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/nestApi/admin/sys/role/listPage',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '成功',
        data: {
          data: {
            data: [
              {
                createTime: '2023-03-10T08:25:47.193Z',
                updateTime: '2023-03-10T08:25:47.193Z',
                id: 'c61fad2f-56ed-4efd-bb06-890f8bc6d2e2',
                name: 'admin',
                code: 'superAdmin',
                remark: '管理员'
              }
            ],
            total: 1
          }
        }
      }
    }
  }
] as MockMethod[]
