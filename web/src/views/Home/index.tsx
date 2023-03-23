import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { setUserInfo } from '@/store/app'

import WebSocketDemo from './components/webSocketDemo'

function index() {
  const { app } = useSelector((state: RootState) => state)
  const userDispatch = useDispatch<AppDispatch>()
  const clickHandler = () => {
    userDispatch(setUserInfo({ name: 'shawn' }))
  }

  return (
    <div>
      <h1>Vite + React</h1>
      <div className="card">
        <h2>name:{app.userInfo?.name}</h2>
        <button onClick={clickHandler}>click todo change redux toolkit</button>
        <WebSocketDemo></WebSocketDemo>
      </div>
    </div>
  )
}

export default index
