import { Dropdown, Menu } from 'antd'
import { updateAssemblySize } from '@/store/app'
import { connect } from 'react-redux'

const AssemblySize = (props: any) => {
  const { assemblySize, updateAssemblySize } = props

  // 切换组件大小
  const onClick = (e: MenuInfo) => {
    updateAssemblySize(e.key)
  }

  const menu = (
    <Menu
      items={[
        {
          key: 'middle',
          disabled: assemblySize === 'middle',
          label: <span>默认</span>,
          onClick
        },
        {
          disabled: assemblySize === 'large',
          key: 'large',
          label: <span>大型</span>,
          onClick
        },
        {
          disabled: assemblySize === 'small',
          key: 'small',
          label: <span>小型</span>,
          onClick
        }
      ]}
    />
  )
  return (
    <Dropdown overlay={menu} placement="bottom" trigger={['click']} arrow={true}>
      <i className="icon-style iconfont icon-contentright"></i>
    </Dropdown>
  )
}

const mapStateToProps = (state: any) => state.app
const mapDispatchToProps = { updateAssemblySize }
export default connect(mapStateToProps, mapDispatchToProps)(AssemblySize)
