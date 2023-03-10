/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-26 22:59:57
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-28 01:58:47
 * @FilePath: \react\react18-vite3-ts-antd4\src\main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ReactDOM from 'react-dom/client'
import '@/styles/reset.less'
import '@/assets/iconfont/iconfont.less'
import '@/assets/fonts/font.less'
import '@/styles/common.less'
import '@/language'
import App from './App'
import { Provider } from 'react-redux'
import store, { persistor } from '@/store'
import { PersistGate } from 'redux-persist/lib/integration/react'

import * as buffer from 'buffer'

if (typeof (window as any).Buffer === 'undefined') {
  ;(window as any).Buffer = buffer.Buffer
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
