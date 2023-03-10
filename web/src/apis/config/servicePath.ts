// 后端微服务端口名
export const prefix1 = '/nestApi'
export const prefix2 = '/hooks'

// 接口域名
const isMock = import.meta.env.VITE_MODE_ENV === 'development' ? false : false
const isProxy = import.meta.env.VITE_MODE_ENV === 'development' ? true : false

const domain = isMock ? './mock' : isProxy ? './proxy' : `${import.meta.env.VITE_API_URL}`
const prefix = import.meta.env.VITE_MODE_ENV === 'development' ? prefix1 : prefix2 // 接口前缀
// 接口路径
export const basePath = `${domain}${prefix}`
