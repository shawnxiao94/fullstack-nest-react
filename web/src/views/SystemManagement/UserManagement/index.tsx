import React, { useState } from 'react'
import { Button } from 'antd'
import SearchFrom from './components/SearchForm'
import TableList from './components/TableList'

import cssModule from './user.module.scss'

const index: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [pageConfig, setPageConfig] = useState({ page: 1, pageSize: 10 })
  const [searchForm, setSearchForm] = useState({})
  const [visible, setVisible] = useState(false)
  const [roleList, setRoleList] = useState<any[]>([])

  const onSearch = (v: any) => {
    setSearchForm(v)
    setPageConfig({ ...pageConfig, page: 1 })
  }
  const onRest = () => {
    setSearchForm({})
    setPageConfig({ ...pageConfig, page: 1 })
  }

  return (
    <div className={cssModule.userContainer}>
      <SearchFrom onSearch={onSearch} roleList={roleList} onRest={onRest}></SearchFrom>
      <div className={cssModule.btnWrap}>
        <Button type="default" onClick={() => setVisible(true)}>
          新建
        </Button>
      </div>
      <TableList></TableList>
    </div>
  )
}

export default index
