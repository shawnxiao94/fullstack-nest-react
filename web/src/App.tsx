/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-26 22:59:57
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-28 01:58:30
 * @FilePath: \react\react18-vite3-ts-antd4\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useState, useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { connect } from 'react-redux'
import { setLanguage } from '@/store/app'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import i18n from 'i18next'
import AuthRouter from '@/router/authRouter'
import Router from '@/router'
import useTheme from '@/hooks/useTheme'
import { getBrowserLang } from '@/utils'
import 'moment/dist/locale/zh-cn'

function App(props: any) {
  const { language, assemblySize, themeConfig, setLanguage } = props
  const [i18nLocale, setI18nLocale] = useState(zhCN)

  // 全局使用主题
  useTheme(themeConfig)

  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language === 'zh') return setI18nLocale(zhCN)
    if (language && language === 'en') return setI18nLocale(enUS)
    if (getBrowserLang() === 'zh') return setI18nLocale(zhCN)
    if (getBrowserLang() === 'en') return setI18nLocale(enUS)
  }

  useEffect(() => {
    // 全局使用国际化
    i18n.changeLanguage(language || getBrowserLang())
    setLanguage(language || getBrowserLang())
    setAntdLanguage()
  }, [language])

  return (
    <HashRouter>
      <ConfigProvider locale={i18nLocale} componentSize={assemblySize}>
        <AuthRouter>
          <Router />
        </AuthRouter>
      </ConfigProvider>
    </HashRouter>
  )
}

const mapStateToProps = (state: any) => state.app
const mapDispatchToProps = { setLanguage }
export default connect(mapStateToProps, mapDispatchToProps)(App)
