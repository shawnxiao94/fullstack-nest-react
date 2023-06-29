import { createSlice } from '@reduxjs/toolkit'
import type { SocketIOWrapperType, SocketStatusType } from '@/utils/socket/socket-io'
import { SocketStatus } from '@/utils/socket/socket-io'

// 定义 state 类型
interface WsState {
  client: SocketIOWrapperType | null
  status: SocketStatusType
}

// 初始状态
const initialState: WsState = {
  client: null,
  status: SocketStatus.CLOSE
}

// 创建 slice
const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setClient(state, action) {
      state.client = action.payload as any
    },
    setStatus(state, action) {
      if (state.status === action.payload) {
        return
      }
      state.status = action.payload
    }
  }
})

export const { setClient, setStatus } = wsSlice.actions

// 导出 reducer、异步 action
export default wsSlice.reducer
