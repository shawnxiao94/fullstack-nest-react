import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ProTable,
  DrawerForm,
  ProFormText,
  ProForm,
  ProFormSwitch,
  ProFormDigit,
  ProFormRadio,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { Button, message, Space, Tag, Switch } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { useMenuManageApi } from '@/apis/modules/sysManage'

import { SysManage } from '@/apis/interface'

type FormItemKeys = SysManage.ReqUpdateMenu

const menuApi = useMenuManageApi()

const index = () => {
  const drawerFormRef = useRef<ProFormInstance>()
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [modalFormMode, setModalFormMode] = useState({ title: '新增', mode: 'add' })
  const [drawerFormValues, setDrawerFormValues] = useState<FormItemKeys>(null as any)
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
  const [treeDataArr, setTreeDataArr] = useState<any[]>([])
  const actionRef: any = useRef<ActionType>()

  const addFn = () => {
    setModalFormMode({ title: '新增', mode: 'add' })
    setDrawerVisit(true)
    setDrawerFormValues(null as any)
  }
  const catDetailFn = row => {
    setModalFormMode({ title: '查看', mode: 'cat' })
    setDrawerFormValues(row)
    setDrawerVisit(true)
  }
  const editModeFormFn = row => {
    setModalFormMode({ title: '编辑', mode: 'edit' })
    setDrawerFormValues(row)
    setDrawerVisit(true)
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

  const columns: ProColumns<FormItemKeys>[] = [
    {
      title: '菜单名称',
      key: 'title',
      dataIndex: 'title',
      ellipsis: true,
      fixed: 'left'
    },
    {
      title: '菜单编码',
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
      title: '菜单类型',
      key: 'type',
      dataIndex: 'type',
      render: (_, record) => (
        <Space>
          {record.type === 0 ? (
            <Tag color="#2db7f5">栏目</Tag>
          ) : record.type === 1 ? (
            <Tag color="#108ee9">菜单</Tag>
          ) : (
            <Tag color="#87d068">权限按钮</Tag>
          )}
        </Space>
      )
    },
    {
      title: '菜单路径',
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
      title: '图标',
      key: 'icon',
      dataIndex: 'icon',
      ellipsis: true
    },
    {
      title: '是否显示',
      key: 'hidden',
      dataIndex: 'hidden',
      editable: () => {
        return false
      },
      render: (_, record) => {
        return <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={record?.hidden} />
      }
    },
    {
      title: '缓存',
      key: 'keepalive',
      dataIndex: 'keepalive',
      editable: () => {
        return false
      },
      render: (_, record) => {
        return <Switch checkedChildren="是" unCheckedChildren="否" checked={record?.keepalive} />
      }
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
      fixed: 'right',
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
      hide()
      return await menuApi.delMenuApi({ id: selectedRows.id })
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
      onFinishSave({ ...fields, level: ~~fields.level, type: ~~fields.type })
      return true
    } catch (error) {
      hide()
      message.error('修改失败，请重试')
      return false
    }
  }
  const onFinishSave = async form => {
    if (modalFormMode.mode === 'add') {
      // 新增
      const res: any = await menuApi.addMenuApi({ ...form, hidden: !!form.hidden })
      if (res) {
        // 刷新
        actionRef?.current?.reload()
      }
      return !!res
    }
    // 编辑
    const res: any = await menuApi.updateMenuApi({
      ...drawerFormValues,
      ...form
    })
    if (res) {
      // 刷新
      actionRef?.current?.reload()
      return true
    }

    return false
  }

  return (
    <>
      <ProTable<FormItemKeys>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        bordered
        expandable={{
          defaultExpandAllRows: true,
          expandedRowKeys
        }}
        request={async (params: any, sort, filter) => {
          console.log(sort, '----', filter, '----', params)
          const data: any = await menuApi.findMenuTreeApi({
            ...params,
            parentId: 'root'
          })
          const newExpandedKeys: string[] = []
          const render = treeDatas => {
            // 获取到所有可展开的父节点
            treeDatas.map((item: any) => {
              newExpandedKeys.push(item.id)
              item.value = item.id
              if (item?.children?.length) {
                render(item.children)
              } else {
                delete item.children
              }
            })
          }
          render(data)
          setExpandedRowKeys(newExpandedKeys)
          setTreeDataArr([...data])
          return { data, success: true }
        }}
        scroll={{ y: 640 }}
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
          persistenceKey: 'pro-table-singe-menu-manage',
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
        headerTitle="菜单列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={addFn}>
            新建
          </Button>
        ]}
      />
      <DrawerForm
        width={750}
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
        onFinish={async values => {
          return await onFinishSave(values)
        }}>
        <ProForm.Group>
          <ProFormRadio.Group
            name="type"
            label="菜单类型"
            width="md"
            initialValue={drawerFormValues?.type}
            disabled={modalFormMode.mode === 'cat'}
            rules={[{ required: true, message: '请选择!', type: 'number' }]}
            options={[
              {
                label: '目录',
                value: 0
              },
              {
                label: '菜单',
                value: 1
              },
              {
                label: '权限按钮',
                value: 2
              }
            ]}
          />
          <ProFormTreeSelect
            initialValue={drawerFormValues?.parentId}
            width="md"
            name="parentId"
            label="上级菜单"
            placeholder="请选择"
            rules={[{ required: true, message: '请选择!', type: 'string' }]}
            request={async () => {
              return [{ value: 'root', label: '顶级', title: '顶级', children: treeDataArr }]
            }}></ProFormTreeSelect>
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            initialValue={drawerFormValues?.name}
            width="md"
            name="name"
            label="路由名"
            placeholder="请输入"
            disabled={modalFormMode.mode === 'cat'}
          />
          <ProFormText
            initialValue={drawerFormValues?.path}
            rules={[{ required: true, message: '请选择!', type: 'string' }]}
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
            initialValue={drawerFormValues?.componentPath}
            width="md"
            name="componentPath"
            disabled={modalFormMode.mode === 'cat'}
            label="组件路径"
            placeholder="请输入"
          />
          <ProFormText
            initialValue={drawerFormValues?.title}
            width="md"
            name="title"
            disabled={modalFormMode.mode === 'cat'}
            label="菜单名称"
            placeholder="请输入"
            rules={[{ required: true, message: '请选择!', type: 'string' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            initialValue={drawerFormValues?.icon}
            width="md"
            name="icon"
            disabled={modalFormMode.mode === 'cat'}
            label="图标"
            placeholder="请输入"
          />
          <ProFormSwitch
            initialValue={drawerFormValues?.hidden}
            width="md"
            name="hidden"
            label="菜单显隐"
            disabled={modalFormMode.mode === 'cat'}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch
            initialValue={drawerFormValues?.keepalive}
            width="md"
            name="keepalive"
            label="缓存"
            disabled={modalFormMode.mode === 'cat'}
          />
          <ProFormDigit
            initialValue={drawerFormValues?.level}
            width="md"
            name="level"
            disabled={modalFormMode.mode === 'cat'}
            label="层级"
            placeholder="请输入"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            initialValue={drawerFormValues?.sort}
            width="md"
            name="sort"
            disabled={modalFormMode.mode === 'cat'}
            label="排序"
            placeholder="请输入"
          />
        </ProForm.Group>
      </DrawerForm>
    </>
  )
}

export default index
