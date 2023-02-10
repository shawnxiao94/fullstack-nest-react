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
