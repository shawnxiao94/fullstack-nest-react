import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'
import { BaseEntityModel } from '../BaseEntityModel'

/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

export const clone = <T extends BaseEntityModel, S, K extends keyof T>(target: T, source: S, exclude?: K[]): T => {
  if (!exclude) {
    exclude = exclude ? exclude.push(...(['createTime', 'updateTime'] as any)) : (['createTime', 'updateTime'] as any)
  }
  for (const key of Object.keys(source)) {
    if (exclude?.includes(key as any)) continue
    const val = source[key]
    target[key] = val ?? target[key]
  }
  return target
}

// 非递归扁平转树
/*
 * @flatArr 扁平数组
 * @reference 带对象引用否，默认false
 */
export function flatArrToTree(flatArr, reference = false) {
  if (reference) {
    // 引用场景
    // 利用两层filter实现
    const data = flatArr.filter((item) => {
      item.children = flatArr.filter((e) => {
        return item.id === e.parentId
      })
      return !item.parentId
    })
    return data
  }
  const result = []
  const map = {}
  for (const item of flatArr) {
    map[item.id] = { ...item, children: [] }
    if (item.parentId === 'root') {
      const newMap = map[item.id]
      result.push(newMap)
    } else {
      map[item.parentId].children.push(map[item.id])
    }
  }
  return result
}

// 扁平递归转树
export function getTreeDataLoop(arr, parentId) {
  function loop(parentId) {
    return arr.reduce((pre, cur) => {
      if (cur.parentId === parentId) {
        cur.children = loop(cur.id)
        pre.push(cur)
      }

      return pre
    }, [])
  }
  return loop(parentId)
}
