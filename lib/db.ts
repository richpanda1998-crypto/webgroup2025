import postgres from "postgres"
import type { Broker } from "./types"
import { brokerNameToSlug } from "./utils"
import { cache, CACHE_KEYS, CACHE_TTL } from "./cache"

/**
 * 数据库连接池单例
 */
let dbConnection: ReturnType<typeof postgres> | null = null

/**
 * 获取数据库连接池（单例模式）
 */
function getDbConnection() {
  if (dbConnection) {
    return dbConnection
  }

  const hasDbConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD

  if (!hasDbConfig) {
    throw new Error("数据库配置不完整，请检查 .env.local 文件")
  }

  dbConnection = postgres({
    host: process.env.DB_HOST!,
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    max: 10, // 连接池最大连接数
    idle_timeout: 60, // 空闲连接保持时间：60秒
    connect_timeout: 10, // 连接超时：10秒
    max_lifetime: 60 * 30, // 连接最大生命周期：30分钟
  })

  return dbConnection
}

/**
 * 获取所有经纪商（带缓存）
 */
export async function getAllBrokersFromDB(): Promise<Broker[]> {
  // 1. 尝试从缓存获取
  const cached = cache.get<Broker[]>(CACHE_KEYS.ALL_BROKERS)
  if (cached) {
    console.log("[缓存命中] 返回经纪商列表缓存")
    return cached
  }

  // 2. 缓存未命中，查询数据库
  try {
    const sql = getDbConnection()
    const brokers = await sql<Broker[]>`
      SELECT * FROM broker_data_web 
      ORDER BY total_score DESC NULLS LAST
    `
    
    // 3. 存入缓存
    cache.set(CACHE_KEYS.ALL_BROKERS, brokers, CACHE_TTL.BROKERS_LIST)
    console.log(`[数据库查询] 获取到 ${brokers.length} 个经纪商，已缓存`)
    
    return brokers
  } catch (error) {
    console.error("[数据库错误] 获取经纪商列表失败:", error)
    return []
  }
}

/**
/**
 * 根据code 或名称 slug 获取经纪商（带缓存）
 */
export async function getBrokerByCodeFromDB(codeOrSlug: string): Promise<Broker | null> {
  // 1. 尝试从缓存获取
  const cacheKey = CACHE_KEYS.BROKER_BY_CODE(codeOrSlug)
  const cached = cache.get<Broker>(cacheKey)
  if (cached) {
    console.log(`[缓存命中] 返回经纪商 ${codeOrSlug} 缓存`)
    return cached
  }

  // 2. 缓存未命中，查询数据库
  try {
    const sql = getDbConnection()
    
    // 先尝试通过 code 查询
    let brokers = await sql<Broker[]>`
      SELECT * FROM broker_data_web 
      WHERE code = ${codeOrSlug}
      LIMIT 1
    `
    
    // 如果没找到，说明可能是 slug，从缓存或数据库获取所有经纪商
    if (brokers.length === 0) {
      // 利用 getAllBrokersFromDB 的缓存，避免重复查询
      const allBrokers = await getAllBrokersFromDB()
      
      // 在应用层匹配 slug
      const matchedBroker = allBrokers.find(broker => 
        brokerNameToSlug(broker.broker) === codeOrSlug
      )
      
      if (matchedBroker) {
        brokers = [matchedBroker]
      }
    }
    
    const broker = brokers.length > 0 ? brokers[0] : null
    
    // 3. 存入缓存
    if (broker) {
      cache.set(cacheKey, broker, CACHE_TTL.BROKER_DETAIL)
      console.log(`[数据库查询] 获取到经纪商 ${codeOrSlug}，已缓存`)
    }
    
    return broker
  } catch (error) {
    console.error(`[数据库错误] 获取经纪商 ${codeOrSlug} 失败:`, error)
    return null
  }
}
/**
 * 根据名称获取经纪商（自动转 slug）
 */
export async function getBrokerByNameFromDB(name: string): Promise<Broker | null> {
  const slug = brokerNameToSlug(name)
  return getBrokerByCodeFromDB(slug)
}
