import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable, DrawerForm, ProFormText, ProFormDateRangePicker } from '@ant-design/pro-components'
import { Row, Col, Tree, Button, message, Card } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { useRoleManageApi, useMenuManageApi } from '@/apis/modules/sysManage'

import type { DataNode } from 'antd/es/tree'
type FormItemKeys = {
  createTime: string
  id: string
  name: string
  code: string
  remark: string
  menus?: any[]
}

const roleApi = useRoleManageApi()
const menuApi = useMenuManageApi()

const index = () => {
  const drawerFormRef = useRef<ProFormInstance>()
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [modalFormMode, setModalFormMode] = useState({ title: '新增', mode: 'add' })
  const [drawerFormValues, setDrawerFormValues] = useState<FormItemKeys>(null as any)
  const actionRef = useRef<ActionType>()
  // tree树形
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  const addFn = () => {
    setModalFormMode({ title: '新增', mode: 'add' })
    setDrawerFormValues(null as any)
    setDrawerVisit(true)
  }
  const catDetailFn = row => {
    setModalFormMode({ title: '查看', mode: 'cat' })
    setDrawerVisit(true)
    setDrawerFormValues(row)
  }
  const editModeFormFn = row => {
    setModalFormMode({ title: '编辑', mode: 'edit' })
    setDrawerFormValues(row)
    setDrawerVisit(true)
  }

  // 获取该角色对应得菜单
  const fetchInfoMenusFn = async () => {
    if (modalFormMode.mode === 'add') {
      drawerFormRef?.current?.resetFields()
      const menus = drawerFormValues?.menus?.length
        ? drawerFormValues.menus.map(m => {
            m.value = m.id
            m.label = m.title
            return m
          })
        : []
      drawerFormRef?.current?.setFieldsValue({
        ...drawerFormValues,
        menus
      })
      setCheckedKeys(menus)
    } else {
      const res: any = await roleApi.findInfoMenusByRoleIdApi({
        id: drawerFormValues?.id,
        requireMenus: true,
        treeType: false
      })
      const menus = res[0].menus?.length ? res[0].menus.map(m => m.id) : []
      drawerFormRef?.current?.setFieldsValue({
        ...drawerFormValues,
        menus
      })
      setCheckedKeys(menus)
    }
  }

  useEffect(() => {
    if (drawerVisit) {
      // console.log('menusOfRole', menusOfRole)
      // 显示时，编辑场景，表单初始化
      fetchInfoMenusFn()
    } else {
      drawerFormRef?.current?.resetFields()
    }
  }, [drawerVisit])

  const columns: ProColumns<FormItemKeys>[] = [
    {
      title: '名称',
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
      title: '编码',
      key: 'code',
      dataIndex: 'code',
      ellipsis: true
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
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
      hide()
      await roleApi.delRoleApi({ id: selectedRows.id })
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
      updateUserInfoFn(fields)
      return true
    } catch (error) {
      hide()
      message.error('修改失败，请重试')
      return false
    }
  }

  // 保存:新增/更新
  const updateUserInfoFn = async params => {
    if (modalFormMode.mode === 'add') {
      // 新增
      await roleApi.addRoleApi({
        ...params,
        menuIds: checkedKeys
      })
      // 刷新
      actionRef?.current?.reload()
      return true
    }
    // 编辑
    const res = await roleApi.updateRolesByIdApi({ ...drawerFormValues, ...params, menuIds: checkedKeys })
    if (res) {
      // 刷新
      actionRef?.current?.reload()
      return true
    }
    return false
  }
  const handleExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys)
  }

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue)
  }
  // 获取tree树形数据
  const findMenuTreeFn = async () => {
    const data: any = await menuApi.findMenuTreeApi({
      parentId: 'root'
    })
    const newExpandedKeys: string[] = []
    const render = treeDatas => {
      // 获取到所有可展开的父节点
      treeDatas.map((item: any) => {
        newExpandedKeys.push(item.id)
        item.value = item.id
        item.key = item.id
        if (item?.children?.length) {
          render(item.children)
        }
      })
    }
    render(data)
    setExpandedKeys([...newExpandedKeys])
    return data
  }

  useEffect(() => {
    findMenuTreeFn().then(res => {
      setTreeData(res)
    })
  }, [])

  return (
    <>
      <ProTable<FormItemKeys>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, '----', filter, '----', params)
          const res: any = await roleApi.findRoleListByPageApi({
            ...params,
            pageSize: params.pageSize as number,
            pageNumber: params.current as number,
            keywords: ''
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
          persistenceKey: 'pro-table-singe-role-manage',
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
        onFinish={async values => {
          return updateUserInfoFn(values)
        }}>
        <Row gutter={[5, 5]}>
          <Col span={12}>
            <ProFormText
              width="md"
              name="name"
              label="名称"
              initialValue={drawerFormValues?.name}
              placeholder="请输入"
              disabled={modalFormMode.mode === 'cat'}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              width="md"
              name="code"
              label="编码"
              initialValue={drawerFormValues?.code}
              tooltip="编码不可重复具唯一性"
              disabled={modalFormMode.mode === 'cat'}
              placeholder="请输入"
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="remark"
              width="md"
              initialValue={drawerFormValues?.remark}
              disabled={modalFormMode.mode === 'cat'}
              label="备注"
              placeholder="请输入备注"
            />
            {modalFormMode.mode === 'cat' ? (
              <Col span={12}>
                <ProFormDateRangePicker name="createTime" initialValue={drawerFormValues?.createTime} disabled label="创建时间" />
              </Col>
            ) : null}
          </Col>
          <Col span={24}>
            <Card title="菜单权限" size="small" style={{ backgroundColor: 'transparent' }}>
              <Tree
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={handleExpand}
                onCheck={onCheck as any}
                checkedKeys={checkedKeys}
                checkable
                selectable={false}></Tree>
            </Card>
          </Col>
          {/* <ProForm.Group>
          <ProFormTreeSelect
            name="menus"
            label="菜单权限"
            placeholder="请选择"
            allowClear
            // secondary
            disabled={modalFormMode.mode === 'cat'}
            width="lg"
            request={async () => {
              const data: any = await menuApi.findMenuTreeApi({
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
                  }
                })
              }
              render(data)
              // setMenusTreeArr(data)
              return data
            }}
            // tree-select args
            fieldProps={{
              showArrow: false,
              filterTreeNode: true,
              showSearch: true,
              treeCheckable: true,
              dropdownMatchSelectWidth: true,
              treeCheckStrictly: true,
              treeDefaultExpandAll: true,
              labelInValue: true,
              autoClearSearchValue: true,
              multiple: true,
              // treeNodeFilterProp: 'id',
              fieldNames: {
                label: 'title',
                value: 'id'
              }
            }}
          />
        </ProForm.Group> */}
        </Row>
      </DrawerForm>
    </>
  )
}

export default index
