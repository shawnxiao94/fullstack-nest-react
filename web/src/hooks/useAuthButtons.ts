import { searchRoute } from '@/utils'
import { useLocation } from 'react-router-dom'
import { asyncRoute } from '@/router'
import store from '@/store'

/**
 * @description 页面按钮权限 hooks
 * */
const useAuthButtons = () => {
  const { pathname } = useLocation()
  const route = searchRoute(pathname, asyncRoute)

  return {
    BUTTONS: store.getState().app.authButtons[route.meta!.key!] || {}
  }
}

export default useAuthButtons
