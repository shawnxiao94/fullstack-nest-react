import { connect } from 'react-redux'
import './index.less'

const LayoutFooter = (props: any) => {
  const { themeConfig } = props
  return (
    <>
      {!themeConfig.footer && (
        <div className="footer">
          <a rel="noreferrer">2022 © Admin By Hooks Technology.</a>
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => state.app
export default connect(mapStateToProps)(LayoutFooter)
