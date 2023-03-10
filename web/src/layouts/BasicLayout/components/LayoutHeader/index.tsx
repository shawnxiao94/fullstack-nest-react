import { Layout } from 'antd'
import { connect } from 'react-redux'
const { Header } = Layout

import CollapseIcon from './components/CollapseIcon'
import BreadcrumbNav from './components/BreadcrumbNav'
import AvatarIcon from './components/AvatarIcon'
import AssemblySize from './components/AssemblySize'
import Language from './components/Language'
import Fullscreen from './components/Fullscreen'
import Theme from './components/Theme'

import './index.less'

const LayoutHeader = (props: any) => {
  return (
    <Header>
      <div className="header-lf">
        <CollapseIcon />
        <BreadcrumbNav />
      </div>
      <div className="header-ri">
        <AssemblySize />
        <Language />
        <Theme />
        <Fullscreen />
        <span className="username">{props.userInfo?.name ? props.userInfo?.name : props.userInfo?.account}</span>
        <AvatarIcon />
      </div>
    </Header>
  )
}

const mapStateToProps = (state: any) => state.app
export default connect(mapStateToProps, null)(LayoutHeader)
