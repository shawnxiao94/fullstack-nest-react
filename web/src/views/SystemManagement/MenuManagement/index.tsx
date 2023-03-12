import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable, DrawerForm, ProFormText, ProForm, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components'
import { Button, message } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { findMenuListApi } from '@/apis/modules/SystemManagement/MenuManagement'

type FormItemKeys = {
  createTime: string
  id: string
  name: string
  code: string
  remark: string
  menus?: any[]
}

const index = () => {
  const drawerFormRef = useRef<ProFormInstance>()
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [modalFormMode, setModalFormMode] = useState({ title: '新增', mode: 'add' })
  const [drawerFormValues, setDrawerFormValues] = useState<FormItemKeys>(null as any)
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

  const columns: ProColumns<FormItemKeys>[] = [
    {
      title: '路由名',
      dataIndex: 'name',
      sorter: true,
      copyable: true,
      ellipsis: true,
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
      title: '路由路径',
      key: 'path',
      dataIndex: 'path',
      ellipsis: true
    },
    {
      title: '组件路径',
      key: 'componentPath',
      dataIndex: 'componentPath',
      ellipsis: true
    },
    {
      title: '菜单名称',
      key: 'title',
      dataIndex: 'title',
      ellipsis: true
    },
    {
      title: '图标',
      key: 'icon',
      dataIndex: 'icon',
      ellipsis: true
    },
    {
      title: '菜单显隐',
      key: 'hidden',
      dataIndex: 'hidden',
      ellipsis: true
    },
    {
      title: '缓存',
      key: 'keepalive',
      dataIndex: 'keepalive',
      ellipsis: true
    },
    {
      title: '层级',
      key: 'level',
      dataIndex: 'level',
      ellipsis: true
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
        </a>
      ]
    }
  ]

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
      <ProTable<FormItemKeys>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, '----', filter, '----', params)
          const data: any = await findMenuListApi({
            ...params,
            pageSize: params.pageSize as number,
            pageNumber: params.current as number,
            keywords: ''
          })
          const res: any = data?.data
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
        pagination={{
          pageSize: 10,
          onChange: page => console.log('page', page)
        }}
        dateFormatter="string"
        headerTitle="角色列表"
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
          <ProFormText width="md" name="name" label="路由名" placeholder="请输入" disabled={modalFormMode.mode === 'cat'} />
          <ProFormText
            width="md"
            name="path"
            label="路由路径"
            tooltip="编码不可重复具唯一性"
            disabled={modalFormMode.mode === 'cat'}
            placeholder="请输入"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="componentPath"
            disabled={modalFormMode.mode === 'cat'}
            label="组件路径"
            placeholder="请输入"
          />
          <ProFormText width="md" name="title" disabled={modalFormMode.mode === 'cat'} label="菜单名称" placeholder="请输入" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="icon" disabled={modalFormMode.mode === 'cat'} label="图标" placeholder="请输入" />
          <ProFormSelect
            width="md"
            options={[
              {
                value: 1,
                label: '显示'
              },
              {
                value: 0,
                label: '隐藏'
              }
            ]}
            name="hidden"
            disabled={modalFormMode.mode === 'cat'}
            placeholder="请选择"
            label="菜单显隐"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch width="md" name="keepalive" label="缓存" disabled={modalFormMode.mode === 'cat'} />
          <ProFormText width="md" name="level" disabled={modalFormMode.mode === 'cat'} label="层级" placeholder="请输入" />
        </ProForm.Group>
      </DrawerForm>
    </>
  )
}

export default index
