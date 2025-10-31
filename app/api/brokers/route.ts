import { NextResponse } from "next/server"
import postgres from "postgres"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const hasDbConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD

  if (!hasDbConfig) {
    return NextResponse.json([])
  }

  try {
    // 使用连接池提高並发性能
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

    const brokers = await sql`
      SELECT * FROM broker_data_web 
      ORDER BY total_score DESC NULLS LAST
    `

    await sql.end()
    return NextResponse.json(brokers)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Database error:", error)
    }
    return NextResponse.json([])
  }
}
