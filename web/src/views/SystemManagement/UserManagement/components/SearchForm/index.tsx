import React, { useState } from 'react'
import { Form, Input, Select, DatePicker, Button } from 'antd'

import cssModule from '../../user.module.scss'

interface UserSearchForm {
  username?: string
  nickname?: string
  roles?: number[]
  dataStatus?: number
  createTimeRange?: string[]
}
interface SearchFormProps {
  onSearch: (v: UserSearchForm) => void
  onRest: () => void
  roleList: any[]
}
const index: React.FC<SearchFormProps> = props => {
  const [searchForm, setSearchForm] = useState<UserSearchForm>({})

  const dataStatusOptions = [
    {
      value: 1,
      label: '启用'
    },
    {
      value: 0,
      label: '停用'
    }
  ] as const

  return (
    <div className={cssModule.searchWrap}>
      <Form layout="inline" onFinish={() => props.onSearch(searchForm)}>
        <Form.Item label="用户名">
          <Input
            value={searchForm.username}
            onChange={e =>
              setSearchForm({
                ...searchForm,
                username: e.target.value
              })
            }></Input>
        </Form.Item>
        <Form.Item label="用户昵称">
          <Input
            value={searchForm.nickname}
            onChange={e =>
              setSearchForm({
                ...searchForm,
                nickname: e.target.value
              })
            }></Input>
        </Form.Item>
        <Form.Item label="状态">
          <Select
            value={searchForm.dataStatus}
            style={{ width: 100 }}
            onChange={v => setSearchForm({ ...searchForm, dataStatus: v })}
            allowClear>
            {dataStatusOptions.map(d => (
              <Select.Option key={d.value} value={d.value}>
                {d.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="关联角色">
          <Select
            mode="multiple"
            value={searchForm.roles}
            placeholder="请选择关联角色"
            style={{ minWidth: 100 }}
            onChange={v => setSearchForm({ ...searchForm, roles: v })}>
            {props.roleList.map(r => {
              return (
                <Select.Option key={r.id} value={r.id}>
                  {r.roleDesc}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label="创建时间" name="createTimeRange">
          <DatePicker.RangePicker
            onChange={(dates, dateStrings) =>
              setSearchForm({
                ...searchForm,
                createTimeRange: dateStrings
              })
            }></DatePicker.RangePicker>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            htmlType="reset"
            onClick={() => {
              setSearchForm({})
              props.onRest()
            }}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default index
