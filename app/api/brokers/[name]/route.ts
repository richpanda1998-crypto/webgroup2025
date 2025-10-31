import { NextResponse } from "next/server"
import postgres from "postgres"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  const hasDbConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD

  if (!hasDbConfig) {
    return NextResponse.json({ error: "Broker not found" }, { status: 404 })
  }

  try {
    // 使用连接池：max 表示最多保持10个连接
    const sql = postgres({
      host: process.env.DB_HOST!,
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      max: 10,              // 最多10个并发连接
      idle_timeout: 60,     // 空闲连接保活时间：60秒
      connect_timeout: 10,  // 连接超时：10秒
    })

    // 通过名称查询（slug 转换为名称）
    const nameQuery = name.replace(/-/g, ' ')
    let brokers = await sql`
      SELECT * FROM broker_data_web 
      WHERE LOWER(broker) = LOWER(${nameQuery})
      LIMIT 1
    `

    await sql.end()

    if (brokers.length === 0) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 })
    }

    return NextResponse.json(brokers[0])
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Database error:", error)
    }
    return NextResponse.json({ error: "Broker not found" }, { status: 404 })
  }
}
