import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'

import WebSocketClass from '@/utils/webSocket'
function index() {
  const ws: any = useRef(null)
  const [message, setMessage] = useState('')
  const [readyState, setReadyState] = useState('正在链接中')
  const [rdNum, SetRdNum] = useState(0)
  /**
   * 伪随机函数，测试用
   *  */
  const getRandomInt = useCallback(() => {
    SetRdNum(Math.floor(Math.random() * Math.floor(999)))
  }, [])

  const webSocketInit = useCallback(() => {
    const stateArr = ['正在链接中', '已经链接并且可以通讯', '连接正在关闭', '连接已关闭或者没有链接成功']
    if (!ws.current || ws.current.readyState === 3) {
      ws.current = new WebSocket('ws://localhost:7070')
      ws.current.onopen = () => setReadyState(stateArr[ws.current?.readyState ?? 0])
      ws.current.onclose = () => setReadyState(stateArr[ws.current?.readyState ?? 0])
      ws.current.onerror = () => setReadyState(stateArr[ws.current?.readyState ?? 0])
      ws.current.onmessage = e => {
        setMessage(e.data)
      }
    }
  }, [ws])

  /**
   * 初始化 WebSocket
   * 且使用 WebSocket 原声方法获取信息
   *  */
  useLayoutEffect(() => {
    getRandomInt()
    webSocketInit()
    return () => {
      ws.current?.close()
    }
  }, [ws, getRandomInt, webSocketInit])

  console.log('ws.readyState', ws.current?.readyState, readyState)

  // eslint-disable-next-line init-declarations
  let websocket

  // webSocket后端主动推送
  const initData = data => {
    console.log(JSON.parse(data))
  }
  useEffect(() => {
    websocket = new WebSocketClass('ws://xxx', initData)
    // 建立websocket连接
    websocket.connect()
    return () => {
      // 关闭websocket
      websocket.closeMyself()
    }
  }, [])
  return (
    <>
      <div className="container">
        <div>message:{message}</div>
        <button
          onClick={() => {
            ws.current?.close()
          }}>
          Clone
        </button>
        <button
          onClick={() => {
            getRandomInt()
            webSocketInit()
          }}>
          start
        </button>
        <button
          onClick={() => {
            if (ws.current?.readyState !== 1) {
              console.log('尚未链接成功')
              setMessage('正在链接')
              return
            }
            ws.current?.send(rdNum.toString())
          }}>
          ID:{rdNum}
        </button>
      </div>
    </>
  )
}

export default index
