import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ProTable,
  TableDropdown,
  ModalForm,
  DrawerForm,
  ProFormText,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect
} from '@ant-design/pro-components'
import { Form, Button, Dropdown, Space, Tag, message } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { findUserListApi } from '@/apis/modules/SystemManagement/UserManagement'

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

const index = () => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const restFormRef = useRef<ProFormInstance>()
  const drawerFormRef = useRef<ProFormInstance>()
  const [modalVisit, setModalVisit] = useState(false)
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [modalFormMode, setModalFormMode] = useState({ title: '新增', mode: 'add' })
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
    setDrawerFormValues(row)
  }

  useEffect(() => {
    if (drawerVisit) {
      // 显示时，编辑场景，表单初始化
      drawerFormRef?.current?.setFieldsValue({
        ...drawerFormValues
      })
    } else {
      drawerFormRef?.current?.resetFields()
    }
  }, [drawerVisit])

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
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
      title: '角色',
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
        <Space>{record.roles.length ? record.roles.map(({ name, code }) => <Tag key={code}>{name}</Tag>) : null}</Space>
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
      valueType: 'select',
      editable: () => {
        return false
      },
      valueEnum: {
        0: {
          text: '禁用',
          status: '0'
        },
        1: {
          text: '启用',
          status: '1',
          disabled: false
        }
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

  const waitTime = (time: number = 100) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  const handleRemove = async selectedRows => {
    const hide = message.loading('删除中')
    if (!selectedRows) return true
    try {
      await setTimeout(() => {
        console.log('remove')
      }, 500)
      hide()
      message.success('删除成功')
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
      await setTimeout(() => {
        console.log('update', fields)
      }, 500)
      hide()
      message.success('修改成功')
      return true
    } catch (error) {
      hide()
      message.error('修改失败，请重试')
      return false
    }
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
          const data: any = await findUserListApi({
            ...params,
            pageSize: params.pageSize as number,
            pageNumber: params.current as number,
            keywords: '',
            status: 1,
            roleIds: [],
            deptId: ''
          })
          const res: any = data?.data
          if (res?.data?.length) {
            res.data.map(item => {
              item.status = item.status === 1 ? '启用' : '禁用'
              return item
            })
          }
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
          persistenceKey: 'pro-table-singe-demos',
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
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setModalVisit(true)
            }}>
            新建test
          </Button>,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={addFn}>
            新建
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: '1st item',
                  key: '1'
                },
                {
                  label: '2nd item',
                  key: '2'
                },
                {
                  label: '3rd item',
                  key: '3'
                }
              ]
            }}>
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        ]}
      />
      <ModalForm<{
        name: string
        company: string
      }>
        title="新增"
        open={modalVisit}
        onOpenChange={setModalVisit}
        form={form}
        formRef={restFormRef}
        autoFocusFirstInput
        submitter={{
          searchConfig: {
            resetText: '重置'
          },
          resetButtonProps: {
            onClick: () => {
              restFormRef.current?.resetFields()
              //   setModalVisible(false);
            }
          }
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run')
        }}
        submitTimeout={2000}
        onFinish={async values => {
          await waitTime(2000)
          console.log(values.name)
          message.success('提交成功')
          return true
        }}>
        <ProForm.Group>
          <ProFormText width="md" name="name" label="签约客户名称" tooltip="最长为 24 位" placeholder="请输入名称" />

          <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
          <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            request={async () => [
              {
                value: 'chapter',
                label: '盖章后生效'
              }
            ]}
            width="xs"
            name="useMode"
            label="合同约定生效方式"
          />
          <ProFormSelect
            width="xs"
            options={[
              {
                value: 'time',
                label: '履行完终止'
              }
            ]}
            name="unusedMode"
            label="合同约定失效效方式"
          />
        </ProForm.Group>
        <ProFormText width="sm" name="id" label="主合同编号" />
        <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
        <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
      </ModalForm>
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
                    props.reset()
                  }}>
                  重置
                </Button>
              )
            ]
          }
        }}
        onFinish={async () => {
          message.success('提交成功')
          return true
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
            tooltip="账号不可重复具唯一性"
            disabled={modalFormMode.mode === 'cat'}
            placeholder="请输入账号"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="nickName" label="昵称" disabled={modalFormMode.mode === 'cat'} placeholder="请输入昵称" />
          <ProFormText name="email" disabled={modalFormMode.mode === 'cat'} label="邮箱" placeholder="请输入邮箱" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="mobile" label="手机" disabled={modalFormMode.mode === 'cat'} placeholder="请输入手机" />
          <ProFormSelect
            options={[
              {
                value: 1,
                label: '生效'
              },
              {
                value: 0,
                label: '禁用'
              }
            ]}
            width="xs"
            name="status"
            disabled={modalFormMode.mode === 'cat'}
            label="账号状态"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="xs"
            options={[
              {
                value: 'root',
                label: '超级管理'
              }
            ]}
            name="roles"
            disabled={modalFormMode.mode === 'cat'}
            label="角色"
          />
          <ProFormText width="sm" name="dept" disabled={modalFormMode.mode === 'cat'} label="部门" />
        </ProForm.Group>
        <ProFormText
          name="remark"
          disabled={modalFormMode.mode === 'cat'}
          label="备注"
          placeholder="请输入备注"
          initialValue="xxxx备注"
        />
        <ProFormText name="address" disabled={modalFormMode.mode === 'cat'} label="地址" initialValue="xxxx地址" />
        {modalFormMode.mode === 'cat' ? <ProFormDateRangePicker name="createTime" disabled label="创建时间" /> : null}
      </DrawerForm>
    </>
  )
}

export default index
