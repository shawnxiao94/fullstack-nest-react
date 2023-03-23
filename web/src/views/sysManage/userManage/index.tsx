import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ProTable,
  TableDropdown,
  DrawerForm,
  ProFormText,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormSwitch
} from '@ant-design/pro-components'
import { Button, Space, Tag, message, Switch } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { useUserManageApi, useRoleManageApi } from '@/apis/modules/sysManage'

type GithubIssueItem = {
  createTime: string
  id: string
  name: string
  account: string
  nickName: string
  avatar: string
  email: string
  mobile: string
  remark: string
  sex: number
  type: number
  status: number
  address: string
  openid: string
  roles: any[]
  dept: string
}

const userApi = useUserManageApi()
const roleApi = useRoleManageApi()

const index = () => {
  const drawerFormRef = useRef<ProFormInstance>()
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [modalFormMode, setModalFormMode] = useState({ title: '新增', mode: 'add' })
  const [rolesOption, setRolesOption] = useState([])
  const [drawerFormValues, setDrawerFormValues] = useState<GithubIssueItem>(null as any)
  const actionRef = useRef<ActionType>()

  const addFn = () => {
    setModalFormMode({ title: '新增', mode: 'add' })
    setDrawerVisit(true)
    setDrawerFormValues(null as any)
  }
  const catDetailFn = row => {
    setModalFormMode({ title: '查看', mode: 'cat' })
    setDrawerVisit(true)
    setDrawerFormValues(row)
  }
  const editModeFormFn = row => {
    setModalFormMode({ title: '编辑', mode: 'edit' })
    setDrawerVisit(true)
    setDrawerFormValues({ ...row, roles: row.roles.map(r => r.id) })
  }

  useEffect(() => {
    if (drawerVisit) {
      if (modalFormMode.mode !== 'add') {
        // 显示时，编辑场景，表单初始化
        drawerFormRef?.current?.setFieldsValue({
          ...drawerFormValues
        })
      } else {
        drawerFormRef?.current?.resetFields()
      }
    } else {
      drawerFormRef?.current?.resetFields()
    }
  }, [drawerVisit])

  // 所属角色列表
  const findRoleListApiFn = async () => {
    const data: any = await roleApi.findRoleListApi({
      keywords: ''
    })
    if (data?.length) {
      const arr = data.map(item => {
        item.value = item.id
        item.label = item.name
        return item
      })
      setRolesOption(arr)
    } else {
      setRolesOption([])
    }
  }
  useEffect(() => {
    findRoleListApiFn()
  }, [])

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '账号',
      dataIndex: 'account',
      sorter: true,
      copyable: true,
      ellipsis: true,
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项'
          }
        ]
      }
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: '昵称',
      key: 'nickName',
      dataIndex: 'nickName',
      ellipsis: true,
      tip: '标题过长会自动收缩'
    },
    {
      title: '手机',
      key: 'mobile',
      dataIndex: 'mobile',
      ellipsis: true
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
      ellipsis: true
    },
    {
      title: '关联角色',
      key: 'roles',
      dataIndex: 'roles',
      ellipsis: true,
      search: false,
      editable: () => {
        return false
      },
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_)
      },
      render: (_, record) => (
        <Space>{record.roles.length ? <Tag color="cyan"> {`['${record.roles.map(r => r.name).join(',')}']`}</Tag> : null}</Space>
      )
    },
    {
      disable: true,
      title: '账号状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      // 只读
      // readonly: true,
      formItemProps: {
        initialValue: 1 // 初始值
      },
      editable: () => {
        return false
      },
      render: (_, record) => {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={!!record?.status} />
      }
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      editable: () => {
        return false
      },
      hideInSearch: false
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}>
          编辑行
        </a>,
        <a rel="noopener noreferrer" key="view" onClick={() => catDetailFn(record)}>
          查看
        </a>,
        <a key="edit" onClick={() => editModeFormFn(record)}>
          编辑
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' }
          ]}
        />
      ]
    }
  ]
  const handleRemove = async selectedRows => {
    const hide = message.loading('删除中')
    if (!selectedRows) return true
    try {
      hide()
      await userApi.delUserApi({ id: selectedRows.id })
      // 刷新
      actionRef?.current?.reload()
      return true
    } catch (error) {
      hide()
      message.error('删除失败，请重试')
      return false
    }
  }
  const handleUpdate = async fields => {
    const hide = message.loading('修改中')
    try {
      hide()
      updateUserInfoFn({ ...fields, roles: fields.roles.map(r => r.id) })
      return true
    } catch (error) {
      hide()
      message.error('修改失败，请重试')
      return false
    }
  }

  // 修改
  const updateUserInfoFn = async params => {
    if (modalFormMode.mode === 'add') {
      // 新增
      await userApi.addUserApi({
        ...params,
        roleIds: params.roles,
        status: params?.status ? 1 : 0,
        mobile: params?.mobile ? params?.mobile : '',
        email: params?.email ? params?.email : '',
        deptId: params?.deptId ? params?.deptId : '',
        avatar: params?.avatar ? params?.avatar : '',
        sex: params?.sex ? 1 : 0
      })
      // 刷新
      actionRef?.current?.reload()
      return true
    }
    // 编辑
    const res = await userApi.updateUserInfoApi({ ...drawerFormValues, ...params, roleIds: params?.roles })
    if (res) {
      // 刷新
      actionRef?.current?.reload()
      message.success('提交成功')
      return true
    }
    return false
  }

  return (
    <>
      <ProTable<GithubIssueItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, '----', filter, '----', params)
          const res: any = await userApi.findUserListApi({
            ...params,
            pageSize: params.pageSize as number,
            pageNumber: params.current as number,
            keywords: '',
            status: 1,
            roleIds: [],
            deptId: ''
          })
          return res
        }}
        editable={{
          type: 'multiple',
          onSave: async (_, data) => {
            await handleUpdate(data)
          },
          onDelete: async (_, data) => {
            await handleRemove(data)
          }
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-user-manage',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value)
          }
        }}
        search={{
          labelWidth: 'auto'
        }}
        options={{
          setting: {
            listsHeight: 400
          }
        }}
        form={{
          ignoreRules: false,
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                createdAt: [values.startTime, values.endTime]
              }
            }
            return values
          }
        }}
        pagination={{
          pageSize: 10,
          onChange: page => console.log('page', page)
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={addFn}>
            新建
          </Button>
        ]}
      />
      <DrawerForm
        onOpenChange={setDrawerVisit}
        title={modalFormMode.title}
        open={drawerVisit}
        formRef={drawerFormRef}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              ...defaultDoms,
              modalFormMode.mode === 'cat' ? null : (
                <Button
                  key="extra-reset"
                  onClick={() => {
                    // props.reset()
                    drawerFormRef.current?.resetFields()
                  }}>
                  重置
                </Button>
              )
            ]
          }
        }}
        onFinish={async values => {
          return updateUserInfoFn(values)
        }}>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="名称"
            tooltip="最长为24 位"
            placeholder="请输入名称"
            disabled={modalFormMode.mode === 'cat'}
          />
          <ProFormText
            width="md"
            name="account"
            label="账号"
            initialValue={drawerFormValues?.account}
            tooltip="账号不可重复具唯一性"
            disabled={modalFormMode.mode !== 'add'}
            placeholder="请输入账号"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="nickName"
            initialValue={drawerFormValues?.nickName}
            label="昵称"
            disabled={modalFormMode.mode === 'cat'}
            placeholder="请输入昵称"
          />
          <ProFormText
            width="md"
            name="email"
            initialValue={drawerFormValues?.email}
            disabled={modalFormMode.mode === 'cat'}
            label="邮箱"
            placeholder="请输入邮箱"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="mobile"
            initialValue={drawerFormValues?.mobile}
            label="手机"
            disabled={modalFormMode.mode === 'cat'}
            placeholder="请输入手机"
          />
          <ProFormSwitch
            width="md"
            name="status"
            initialValue={drawerFormValues?.status}
            fieldProps={{ checkedChildren: '开启', unCheckedChildren: '关闭' }}
            label="账号状态"
            disabled={modalFormMode.mode === 'cat'}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="md"
            options={rolesOption}
            name="roles"
            initialValue={drawerFormValues?.roles}
            fieldProps={{
              mode: 'multiple'
            }}
            disabled={modalFormMode.mode === 'cat'}
            label="关联角色"
          />
          <ProFormText
            width="md"
            name="dept"
            initialValue={drawerFormValues?.dept}
            disabled={modalFormMode.mode === 'cat'}
            label="部门"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="avatar"
            initialValue={drawerFormValues?.avatar}
            disabled={modalFormMode.mode === 'cat'}
            label="头像"
          />
          <ProFormSwitch
            width="md"
            name="sex"
            initialValue={drawerFormValues?.sex}
            fieldProps={{ checkedChildren: '男', unCheckedChildren: '女' }}
            label="性别"
            disabled={modalFormMode.mode === 'cat'}
          />
        </ProForm.Group>
        <ProFormText
          name="remark"
          disabled={modalFormMode.mode === 'cat'}
          label="备注"
          initialValue={drawerFormValues?.remark}
          placeholder="请输入备注"
        />
        <ProFormText name="address" disabled={modalFormMode.mode === 'cat'} label="地址" initialValue="xxxx地址" />
        {modalFormMode.mode === 'cat' ? <ProFormDateRangePicker name="createTime" disabled label="创建时间" /> : null}
      </DrawerForm>
    </>
  )
}

export default index
