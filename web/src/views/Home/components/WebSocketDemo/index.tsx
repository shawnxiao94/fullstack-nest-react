import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
// import WebSocketClient, { Message } from '@/utils/socket'
// import { io } from 'socket.io-client'
import io from 'socket.io-client'

const ENDPOINT = import.meta.env.VITE_APP_BASE_SOCKET_NSP // WebSocket服务器的地址
console.log('ENDPOINT', ENDPOINT)
function index(props: any) {
  const [messages, setMessages] = useState<string[]>([]) // 保存消息
  const [text, setText] = useState('') // 保存输入框中的文本
  const socketRef: any = useRef() // 保存Socket.IO客户端的引用

  useEffect(() => {
    // 创建Socket.IO客户端
    socketRef.current = io(ENDPOINT, {
      path: import.meta.env.VITE_APP_BASE_SOCKET_PATH, // 指定WebSocket服务器的路径
      transports: ['websocket'],
      query: { token: props.token }
      // cors: {
      //   origin: 'http://localhost:3301', // 允许跨域的源地址
      //   methods: ['GET', 'POST'], // 允许的 HTTP 请求方法
      //   allowedHeaders: ['Authorization', 'Content-Type'], // 允许的头部信息
      //   credentials: true // 是否支持 cookies
      // }
      // forceNew: true // 强制创建新的连接,forceNew 选项创建新的连接，以避免缓存旧连接时可能出现的问题
    } as any)

    socketRef.current.on('connect', (socket: any): void => {
      console.log(`已连接到WebSocket服务器⚡: ${socket?.id}`)
    })
    // 监听WebSocket服务器发送的消息
    socketRef.current.on('message', message => {
      console.log('⚡:message', message)
      setMessages(prevMessages => [...prevMessages, message])
    })
    // 在组件卸载时关闭WebSocket连接
    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  const handleSubmit = event => {
    event.preventDefault()

    if (!text) {
      return
    }

    // 发送文本消息到WebSocket服务器
    socketRef.current.emit('message', text)
    setText('')
  }
  return (
    <>
      <div>
        <ul>
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input type="text" value={text} onChange={event => setText(event.target.value)} />
          <button type="submit">发送</button>
        </form>
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => state.app
export default connect(mapStateToProps, null)(index)
