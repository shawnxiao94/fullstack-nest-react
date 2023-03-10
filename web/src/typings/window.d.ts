/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-27 00:24:03
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-27 00:24:49
 * @FilePath: \react\react18-vite3-ts-antd4\src\typings\window.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// * Menu
declare namespace Menu {
  interface MenuOptions {
    path: string
    title: string
    icon?: string
    isLink?: string
    close?: boolean
    children?: MenuOptions[]
  }
}

// * Vite
declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
  VITE_API_URL: string
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_GLOB_APP_TITLE: string
  VITE_DROP_CONSOLE: boolean
  VITE_PROXY_URL: string
  VITE_BUILD_GZIP: boolean
  VITE_REPORT: boolean
}

// * Dropdown MenuInfo
declare interface MenuInfo {
  key: string
  keyPath: string[]
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}
