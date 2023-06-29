import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
const { Sider, Content } = Layout

import LayoutHeader from './components/LayoutHeader'
import LayoutMenu from './components/LayoutMenu'
import LayoutTabs from './components/LayoutTabs'
import LayoutFooter from './components/LayoutFooter'

// import { initSocket } from '@/utils/socket/useSocket'
import './index.less'

const LayoutIndex = (props: any) => {
  useEffect(() => {
    // initSocket()
  }, [])
  return (
    // 这里不用 Layout 组件原因是切换页面时样式会先错乱然后在正常显示，造成页面闪屏效果
    <section className="container">
      <Sider trigger={null} collapsed={props.isCollapse} width={220} theme="dark">
        <LayoutMenu></LayoutMenu>
      </Sider>
      <Layout>
        <LayoutHeader></LayoutHeader>
        <LayoutTabs></LayoutTabs>
        <Content>
          <Outlet></Outlet>
        </Content>
        <LayoutFooter></LayoutFooter>
      </Layout>
    </section>
  )
}

const mapStateToProps = (state: any) => state.app
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(LayoutIndex)
