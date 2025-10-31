/**
 * 内存缓存管理
 * 使用简单的 Map 作为缓存存储，适合单服务器部署
 * 如果需要多服务器共享缓存，可以改用 Redis
 */

interface CacheItem<T> {
  data: T
  expireAt: number
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // 每5分钟清理一次过期缓存
    this.startCleanup()
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param ttl 过期时间（秒），默认5分钟
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    const expireAt = Date.now() + ttl * 1000
    this.cache.set(key, { data, expireAt })
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据或 null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() > item.expireAt) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 启动定期清理过期缓存
   */
  private startCleanup(): void {
    if (this.cleanupInterval) return

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const expiredKeys: string[] = []

      // 找出所有过期的键
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expireAt) {
          expiredKeys.push(key)
        }
      }

      // 删除过期的键
      expiredKeys.forEach(key => this.cache.delete(key))

      if (expiredKeys.length > 0) {
        console.log(`[缓存清理] 清理了 ${expiredKeys.length} 个过期缓存`)
      }
    }, 5 * 60 * 1000) // 每5分钟执行一次
  }

  /**
   * 停止清理任务（用于优雅关闭）
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// 导出单例
export const cache = new MemoryCache()

// 缓存键前缀
export const CACHE_KEYS = {
  ALL_BROKERS: "brokers:all",
  BROKER_BY_CODE: (code: string) => `broker:code:${code}`,
} as const

// 缓存过期时间（秒）
export const CACHE_TTL = {
  BROKERS_LIST: 5 * 60, // 经纪商列表：5分钟
  BROKER_DETAIL: 10 * 60, // 经纪商详情：10分钟
} as const
