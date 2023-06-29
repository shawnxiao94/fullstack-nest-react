import { useEffect } from 'react'
import { Modal } from 'antd'
import { SocketIOWrapper, SocketStatus } from '@/utils/socket/socket-io'
import {
  EVENT_KICK
  // , EVENT_UPDATE_MENU
} from '@/utils/socket/event-type'
import { setToken } from '@/store/app'
import { setClient, setStatus } from '@/store/ws'
import { useAppDispatch, useAppSelector, RootState } from '@/store'

const useWebSocket = () => {
  const dispatch = useAppDispatch()
  const wsState = useAppSelector((state: RootState) => state.ws)
  const appState = useAppSelector((state: RootState) => state.app)

  useEffect(() => {
    if (!wsState.client || wsState.client?.isConnected?.()) {
      return
    }

    const ws = new SocketIOWrapper(import.meta.env.VITE_APP_BASE_SOCKET_NSP, import.meta.env.VITE_APP_BASE_SOCKET_PATH, {
      token: appState.token
    })
    ws.subscribe(EVENT_KICK, async data => {
      // reset token
      dispatch(setToken(''))
      Modal.warning({
        title: '警告',
        content: `您已被管理员${data.operater}踢下线！`,
        centered: true,
        okText: '重新登录',
        onOk() {
          // 刷新页面
          window.location.reload()
        }
      })
    })

    dispatch(setClient(ws))
    dispatch(setStatus(SocketStatus.CONNECTING))

    return () => {
      ws.close()
      dispatch(setStatus(SocketStatus.CLOSE))
    }
  }, [wsState.client])

  return wsState
}

export default useWebSocket
