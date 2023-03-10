/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-27 00:24:17
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-27 00:24:24
 * @FilePath: \react\react18-vite3-ts-antd4\src\typings\global.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// * global
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void
    browserLanguage: string
  }
}
declare module '@'
export {}
