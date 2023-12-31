import logo from '@/assets/images/logo.png'
import { connect } from 'react-redux'

const Logo = (props: any) => {
  const { isCollapse } = props
  return (
    <div className="logo-box">
      <img src={logo} alt="logo" className="logo-img" />
      {!isCollapse ? <h2 className="logo-text">react Admin</h2> : null}
    </div>
  )
}

const mapStateToProps = (state: any) => state.app
export default connect(mapStateToProps)(Logo)
